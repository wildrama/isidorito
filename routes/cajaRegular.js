const express = require('express');

const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Producto = require('../models/productos');
const Venta = require('../models/ventas');
const Oferta = require('../models/ofertas');
const OfertaSingular = require('../models/ofertaSingular');
const EstacionDeCobro = require('../models/estaciondecobro');
const { isLoggedIn, hasAnyRole } = require('../middleware');

const allowCashAccess = hasAnyRole(['CAJA', 'ADMINISTRADOR']);

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const escapeRegex = (text = '') => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const summarizeProducto = (producto) => ({
  _id: producto._id,
  codigo: producto.codigo,
  nombre: producto.nombre,
  marca: producto.marca,
  cantidad: toNumber(producto.cantidad),
  precioMinorista: toNumber(producto.precioMinorista),
  categoriaInterna: producto.categoriaInterna || '',
  presentacion: producto.presentacion || ''
});

const summarizeOfertaConjunto = (oferta) => ({
  _id: oferta._id,
  nombreOferta: oferta.nombreOferta,
  precioOferta: toNumber(oferta.precioOferta),
  productosEnOfertaConCodigo: (oferta.productosEnOfertaConCodigo || []).map(summarizeProducto),
  productosTexto: (oferta.productosEnOfertaConCodigo || [])
    .map((producto) => producto.nombre)
    .filter(Boolean)
    .join(' + ')
});

const summarizeOfertaIndividual = (oferta) => ({
  _id: oferta._id,
  cantidadDeUnidadesNecesarias: toNumber(oferta.cantidadDeUnidadesNecesarias, 1),
  precioOferta: toNumber(oferta.precioOferta),
  productoEnOferta: oferta.productoEnOferta ? summarizeProducto(oferta.productoEnOferta) : null,
  descripcion: oferta.productoEnOferta
    ? `${oferta.cantidadDeUnidadesNecesarias}u de ${oferta.productoEnOferta.nombre} por $${toNumber(oferta.precioOferta).toFixed(2)}`
    : 'Oferta automática'
});

async function getCajaContext(estacionId) {
  const estacionDeCobro = await EstacionDeCobro.findById(estacionId).lean();

  if (!estacionDeCobro) {
    throw new Error('La estación de cobro no existe');
  }

  const [ofertasConjuntoRaw, ofertasIndividualesRaw] = await Promise.all([
    Oferta.find({ estacionesDeCobroParaLaOferta: estacionId }).populate('productosEnOfertaConCodigo').lean(),
    OfertaSingular.find({ estacionesDeCobroParaLaOferta: estacionId }).populate('productoEnOferta').lean()
  ]);

  return {
    estacionDeCobro,
    ofertasConjuntoParaEstacion: ofertasConjuntoRaw.map(summarizeOfertaConjunto),
    ofertasIndividualesParaEstacion: ofertasIndividualesRaw.map(summarizeOfertaIndividual)
  };
}

async function searchProducts(searchTerm) {
  const term = String(searchTerm || '').trim();
  if (!term) return [];

  const regex = new RegExp(escapeRegex(term), 'i');
  const query = { $or: [{ nombre: regex }, { marca: regex }] };
  const foundByText = await Producto.find(query).sort({ nombre: 1 }).limit(20).lean();

  let foundByCode = [];
  if (/^\d+$/.test(term)) {
    foundByCode = await Producto.find({ codigo: Number(term) }).limit(10).lean();

    if (!foundByCode.length) {
      const candidates = await Producto.find({}, 'codigo nombre marca cantidad precioMinorista categoriaInterna presentacion').limit(300).lean();
      foundByCode = candidates.filter((producto) => String(producto.codigo || '').includes(term));
    }
  }

  const unique = new Map();
  [...foundByCode, ...foundByText].forEach((producto) => {
    unique.set(String(producto._id), producto);
  });

  return Array.from(unique.values()).slice(0, 20);
}

function calculateProductLine(producto, quantity, ofertasIndividuales = []) {
  const qty = Math.max(1, Math.floor(toNumber(quantity, 1)));
  const unitPrice = toNumber(producto.precioMinorista);
  const regularTotal = unitPrice * qty;

  const ofertaAplicable = ofertasIndividuales.find((oferta) => {
    const productoId = oferta.productoEnOferta && oferta.productoEnOferta._id
      ? String(oferta.productoEnOferta._id)
      : String(oferta.productoEnOferta || '');

    return productoId === String(producto._id);
  });

  if (!ofertaAplicable || qty < toNumber(ofertaAplicable.cantidadDeUnidadesNecesarias, 1)) {
    return {
      subtotal: Number(regularTotal.toFixed(2)),
      discount: 0,
      offerNote: ''
    };
  }

  const packSize = Math.max(1, toNumber(ofertaAplicable.cantidadDeUnidadesNecesarias, 1));
  const packPrice = toNumber(ofertaAplicable.precioOferta);
  const fullPacks = Math.floor(qty / packSize);
  const remainder = qty % packSize;
  const subtotal = (fullPacks * packPrice) + (remainder * unitPrice);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number((regularTotal - subtotal).toFixed(2)),
    offerNote: `${packSize}u por $${packPrice.toFixed(2)}`
  };
}

router.get('/:id/inicio', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const estacionDeCobroId = req.params.id;
  const usuario = req.user;
  const estacionDeCobro = await EstacionDeCobro.findById(estacionDeCobroId);
  const fechaActual = new Date().toLocaleDateString('es-AR');

  if (!estacionDeCobro) {
    req.flash('error', 'No se encontró la estación de cobro');
    return res.redirect('/ingreso-caja');
  }

  res.render('caja/cajainicio', { estacionDeCobro, usuario, fechaActual });
}));

router.get('/:id/cajaActiva', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const estacionDeCobroId = req.params.id;
  const usuarioID = req.user.id;
  const tipoUsuario = req.user.funcion;

  try {
    const { estacionDeCobro, ofertasConjuntoParaEstacion, ofertasIndividualesParaEstacion } = await getCajaContext(estacionDeCobroId);

    const cajaData = {
      estacionId: String(estacionDeCobro._id),
      estacionNombre: estacionDeCobro.ubicacionDeEstacion || 'Caja',
      dineroBase: toNumber(estacionDeCobro.dineroDeInicio),
      dineroActual: toNumber(estacionDeCobro.dineroEnEstacion),
      usuarioId: usuarioID,
      usuarioNombre: req.user.username,
      tipoUsuario,
      ofertasConjunto: ofertasConjuntoParaEstacion.slice(0, 9),
      ofertasIndividuales: ofertasIndividualesParaEstacion
    };

    res.render('caja/cajacobro', {
      ofertasIndividualesParaEstacion,
      ofertasConjuntoParaEstacion,
      usuarioID,
      estacionDeCobro,
      tipoUsuario,
      cajaData,
      fechaActual: new Date().toLocaleString('es-AR')
    });
  } catch (error) {
    req.flash('error', 'No se pudo abrir la caja. Intenta de nuevo.');
    res.redirect(`/caja/${estacionDeCobroId}/inicio`);
  }
}));

router.get('/ofertasFetch', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const estacionDeCobroId = req.query.idESTACION;

  try {
    const { ofertasConjuntoParaEstacion, ofertasIndividualesParaEstacion } = await getCajaContext(estacionDeCobroId);
    res.json({ ofertasConjuntoParaEstacion, ofertasIndividualesParaEstacion });
  } catch (error) {
    res.status(400).json({ success: false, message: 'No se pudieron cargar las ofertas' });
  }
}));

router.get('/:id/productos/buscar', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const productos = await searchProducts(req.query.q);
  res.json({ success: true, data: productos.map(summarizeProducto) });
}));

router.post('/buscar', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const productos = await searchProducts(req.body.codigo || req.body.query || '');

  if (!productos.length) {
    return res.status(404).json(null);
  }

  res.json(summarizeProducto(productos[0]));
}));

router.post('/:id/registrar-venta', isLoggedIn, allowCashAccess, catchAsync(async (req, res) => {
  const estacionId = req.params.id;
  const { items = [], metodoPago = 'EFECTIVO', efectivoRecibido = 0, ticketEntregado = 'SI' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No hay productos en la compra actual.' });
  }

  const { estacionDeCobro, ofertasIndividualesParaEstacion } = await getCajaContext(estacionId);

  if (!estacionDeCobro) {
    return res.status(404).json({ success: false, message: 'La estación de cobro no existe.' });
  }

  let totalVenta = 0;
  let cantidadTotal = 0;
  const productosDeStock = [];
  const productosSinStock = [];
  const stockChanges = new Map();

  const addStockChange = (productId, quantity) => {
    const key = String(productId);
    const current = stockChanges.get(key);

    stockChanges.set(key, {
      productId,
      quantity: (current ? current.quantity : 0) + quantity
    });
  };

  for (const item of items) {
    const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)));

    if (item.kind === 'offer') {
      const oferta = await Oferta.findById(item.offerId).populate('productosEnOfertaConCodigo').lean();

      if (!oferta) {
        return res.status(400).json({ success: false, message: 'Una de las ofertas seleccionadas ya no existe.' });
      }

      const totalOferta = toNumber(oferta.precioOferta) * quantity;
      const productsInOffer = oferta.productosEnOfertaConCodigo || [];
      const valorPorProducto = productsInOffer.length
        ? totalOferta / productsInOffer.length
        : totalOferta;

      totalVenta += totalOferta;
      cantidadTotal += quantity * Math.max(productsInOffer.length, 1);

      if (!productsInOffer.length) {
        productosSinStock.push({
          valorDelProductoEnLaCompra: totalOferta.toFixed(2),
          identificadorDeProducto: oferta._id.toString()
        });
      }

      productsInOffer.forEach((producto) => {
        addStockChange(producto._id, quantity);
        productosDeStock.push({
          valorDelProductoEnLaCompra: valorPorProducto.toFixed(2),
          identificadorDeProducto: producto._id
        });
      });

      continue;
    }

    const producto = await Producto.findById(item.productId).lean();

    if (!producto) {
      return res.status(400).json({ success: false, message: 'Uno de los productos seleccionados ya no existe.' });
    }

    const calculation = calculateProductLine(producto, quantity, ofertasIndividualesParaEstacion);
    totalVenta += calculation.subtotal;
    cantidadTotal += quantity;
    addStockChange(producto._id, quantity);

    productosDeStock.push({
      valorDelProductoEnLaCompra: calculation.subtotal.toFixed(2),
      identificadorDeProducto: producto._id
    });
  }

  for (const { productId, quantity } of stockChanges.values()) {
    const producto = await Producto.findById(productId).lean();

    if (!producto) {
      return res.status(400).json({ success: false, message: 'No se pudo validar el stock de la compra.' });
    }

    if (toNumber(producto.cantidad) < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente para ${producto.nombre}. Disponible: ${toNumber(producto.cantidad)}.`
      });
    }
  }

  const totalRedondeado = Number(totalVenta.toFixed(2));
  const esEfectivo = metodoPago === 'EFECTIVO';
  const montoRecibido = esEfectivo ? toNumber(efectivoRecibido, totalRedondeado) : totalRedondeado;

  if (esEfectivo && montoRecibido < totalRedondeado) {
    return res.status(400).json({ success: false, message: 'El efectivo recibido no alcanza para cubrir el total.' });
  }

  const vuelto = esEfectivo ? Number((montoRecibido - totalRedondeado).toFixed(2)) : 0;
  const tipoDePagoPersistido = esEfectivo ? 'EFECTIVO' : 'OTRO';

  const ventaEfectuada = new Venta({
    dineroIngresado: montoRecibido,
    dineroDeSalida: vuelto,
    productosDeStock,
    productosSinStock,
    ticketEntregado: ticketEntregado === 'NO' ? 'NO' : 'SI',
    tipoDePago: tipoDePagoPersistido,
    cantidadDeProductosTotales: cantidadTotal,
    estacionDeCobro: estacionId,
    nombreDelUsuario: req.user.username
  });

  await ventaEfectuada.save();

  await Promise.all(
    Array.from(stockChanges.values()).map(({ productId, quantity }) => Producto.findByIdAndUpdate(productId, {
      $inc: {
        cantidad: -quantity,
        cantidadDeVecesVendido: quantity
      }
    }))
  );

  const stationUpdate = esEfectivo
    ? {
        dineroEnEstacion: totalRedondeado,
        dineroDeVentasEnEfectivo: totalRedondeado,
        comprasRealizadasEnEfectivo: 1
      }
    : {
        dineroDeVentasEnOtro: totalRedondeado,
        comprasRealizadasEnOtro: 1
      };

  await EstacionDeCobro.findByIdAndUpdate(estacionId, {
    $inc: stationUpdate,
    $push: { ventasRealizadasEnLaEstacion: ventaEfectuada._id }
  }).exec();

  res.json({
    success: true,
    message: 'Venta registrada correctamente',
    ventaId: ventaEfectuada._id,
    total: totalRedondeado,
    cambio: vuelto,
    metodoSeleccionado: metodoPago,
    metodoRegistrado: tipoDePagoPersistido
  });
}));

module.exports = router;
