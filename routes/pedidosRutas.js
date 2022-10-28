const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isCaja } = require('../middleware');
const Pedidos = require('../models/pedidosRepartidor');
const Clientes = require('../models/clientes');
const Producto = require('../models/productos');




const roleADM = 'ADMINISTRADOR';
const roleCaja = 'CAJA';

// isLoggedIn,isAdmin(roleADM),
// 

router.get('/pedidos-repartidor', (req,res)=>{
    res.render('pedidos/pedidoIndx');
})
// crear pedido
router.get('/crear-pedido', catchAsync(async(req,res)=>{
    const clientesActuales = await Clientes.find({})
    const fechaHoy = Date.now();
    res.render('pedidos/crearPedido',{clientesActuales,fechaHoy});
}));

router.post('/crear-pedido',catchAsync(async(req,res)=>{
    const nuevoPedido = new Pedidos(req.body.nuevoPedido);
    await nuevoPedido.save()
    req.flash('success','Nuevo pedido realizo correctamente')
    res.redirect(`/pedidos/${nuevoProducto._id}`)



}))
// mostrar todos los pedidos realizados por un usuario en particular
router.get('/panel-pedidos/:id',isLoggedIn , catchAsync(async (req, res) => {
    // const busqueda = req.body.busqueda
    const idUsuario = req.params.id;
     const pedidos = await Pedidos.find({usuarioRepartidor:idUsuario});
     const cantidadTotalDePedidos = await Pedidos.countDocuments({usuarioRepartidor:idUsuario}).exec();
     res.render('stock/verStock', { pedidos, cantidadTotalDePedidos });
  
 
 
 }))

//mostrar todos los pedidos realizados

router.get('/',isLoggedIn , catchAsync(async (req, res) => {
    // const busqueda = req.body.busqueda
     console.log(req.user.funcion)
     const pedidos = await Pedidos.find({});
     const cantidadTotalDePedido = await Pedidos.countDocuments({}).exec();
     res.render('stock/verStock', { pedidos, cantidadTotalDePedido });
  
 
 
 }))

//  buscar productos para el pedido


router.get('/buscar-productos', catchAsync(async (req, res) => {
    const inputData = req.query.busqueda;
     console.log(req.query.busqueda)
     try {
  
        const busquedaRealizada = await Producto.find({
           $or:[
             {nombre:{$regex: inputData, $options : 'i'}},
             {marca:{$regex: inputData, $options : 'i'}}
            
           ]
             });
  
  
             console.log(busquedaRealizada);
             res.json(busquedaRealizada);
  
    } catch (error) {
        res.send(error)
    }
    //  const cantidadTotalDePedido = await Pedidos.countDocuments({}).exec();
    //  res.render('stock/verStock', { pedidos, cantidadTotalDePedido });
    
//  res.send(busquedaRealizada)
 
 }))

// editar un pedido en especifico


// marcar como "ENTREGADO" a un pedido


// imprimir Pedido
module.exports = router;