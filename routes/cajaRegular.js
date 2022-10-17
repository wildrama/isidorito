const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const catchAsync =require('../utils/catchAsync');
// const {isLoggedIn} = require('../middleware');
const Producto = require('../models/productos');
const Venta = require('../models/ventas');
const Oferta = require('../models/ofertas');
const OfertaSingular = require('../models/ofertaSingular');

const {isLoggedIn,isCaja} = require('../middleware');
const EstacionDeCobro = require('../models/estaciondecobro');

const rolecAJA= 'CAJA';


// isCaja(rolecAJA)
// isCaja(rolecAJA)
// isCaja(rolecAJA)
  
// READ PRODUCT {
  // isLoggedIn,

// inicio de la estacion
router.get('/:id/inicio',isLoggedIn, catchAsync( async (req, res) => {
  const estacionDeCobroId = req.params.id;
  const usuario = req.user;
  const estacionDeCobro = await EstacionDeCobro.findById(estacionDeCobroId);
  const fechaActual = new Date().toLocaleDateString();
  res.render('caja/cajainicio',{estacionDeCobro,usuario,fechaActual});
  
}));

// ir a la caja y llevar las ofertas
router.get('/:id/cajaActiva', isLoggedIn,catchAsync( async (req, res) => {
  

  try {
    const estacionDeCobroId = req.params.id;
    const usuarioID = req.user.id;
    const tipoUsuario =req.user.funcion;

    const estacionDeCobro = await EstacionDeCobro.findById(estacionDeCobroId);
    // const ofertasConjuntoParaEstacion = await Oferta.find({})
    const ofertasConjuntoParaEstacion = await Oferta.find({estacionesDeCobroParaLaOferta: mongoose.Types.ObjectId(estacionDeCobroId)}).exec();

    const ofertasIndividualesParaEstacion = await OfertaSingular.find({estacionesDeCobroParaLaOferta: mongoose.Types.ObjectId(estacionDeCobroId)}).exec();
   console.log('estacion actual');
  //  console.log(estacionDeCobro)
    
    console.log('ofertasConjunto:')
  //  console.log(ofertasConjuntoParaEstacion)

    console.log('ofertasIndividuales:')
  //  console.log(ofertasIndividualesParaEstacion)
    res.render('caja/cajacobro',{ofertasIndividualesParaEstacion,ofertasConjuntoParaEstacion,usuarioID,estacionDeCobro,tipoUsuario});
  } catch (error) {
    req.flash('error','Intenta de nuevo');
    res.redirect(`/caja/${estacionDeCobroId}/inicio`)
  }
  
}));


// ofertas json
router.get('/ofertasFetch', catchAsync( async (req, res) => {
  
const estacionDeCobroId = req.query.idESTACION;
  try {

    // const ofertasConjuntoParaEstacion = await Oferta.find({})
    const ofertasConjuntoParaEstacion = await Oferta.find({estacionesDeCobroParaLaOferta: mongoose.Types.ObjectId(estacionDeCobroId)}).exec();

    const ofertasIndividualesParaEstacion = await OfertaSingular.find({estacionesDeCobroParaLaOferta: mongoose.Types.ObjectId(estacionDeCobroId)}).exec();
    
    res.json({ofertasConjuntoParaEstacion,ofertasIndividualesParaEstacion});
      
  } catch (error) {
    res.json('NO SE PUEDE BUSCAR OFERTAS')
  }
  
}));
router.post('/buscar', isLoggedIn, async (req, res) => {
  try {
    const codigo = req.body.codigo;
    console.log(codigo);
     const producto = await Producto.findOne({codigo: codigo });
    res.json(producto);    
  } catch (error) {
      res.send('error')
  } 


})

router.post('/finalizar-compra', isLoggedIn, async (req, res) => {
    const {compraFinalizada} = req.body;
    const producto = await Producto.findOne({codigo: codigoInput})
    
    res.json(producto);
        
  })
// }


// ENVIAR DATOS DEL FORMULARIO A LA BBDD

router.post('/',isLoggedIn, catchAsync( async (req,res)=>{
 const nuevoProducto = new Producto (req.body);
 await nuevoProducto.save();
  res.redirect(`/administrador/productos/${nuevoProducto._id}`)
} ))

// }




module.exports = router;
