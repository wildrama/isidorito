const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isCaja } = require('../middleware');
const Pedidos = require('../models/pedidosRepartidor');
const Clientes = require('../models/clientes');




const roleADM = 'ADMINISTRADOR';
const roleCaja = 'CAJA';

// isLoggedIn,isAdmin(roleADM),
// 
router.get('/pedidos-repartidor', (req,res)=>{
    res.render('pedidos/pedidoIndx');
})
// crear pedido
router.get('/crear-pedido', (req,res)=>{
    res.render('pedidos/crearPedido');
})

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

// editar un pedido en especifico


// marcar como "ENTREGADO" a un pedido


// imprimir Pedido
module.exports = router;