const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isCaja } = require('../middleware');
const Pedido = require('../models/pedidosRepartidor');
const Cliente = require('../models/clientes');
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
    const clientesActuales = await Cliente.find({})
    const fechaHoy = Date.now();
    res.render('pedidos/crearPedido',{clientesActuales,fechaHoy});
}));

router.post('/crear-pedido',catchAsync(async(req,res)=>{
    const nuevoPedido = new Pedido(req.body.nuevoPedido);
    await nuevoPedido.save()
    req.flash('success','Nuevo pedido realizo correctamente')
    res.redirect(`/pedidos/${nuevoProducto._id}`)



}))
// isAdmin(roleADM),
// RENDER VER TABLA DE STOCK
router.get('/stockMayorista',isLoggedIn , catchAsync(async (req, res) => {
    const busqueda = req.params.busquedaStock
     console.log(req.user.funcion)
     const productos = await Producto.find({});
    //  const cantidadTotalDeProductos = await Producto.countDocuments({}).exec();
     res.render('pedidos/productosStock', { productos});
    
    
    
 }))
// mostrar todos los pedidos realizados por un usuario en particular
router.get('/panel-pedidos/:id',isLoggedIn , catchAsync(async (req, res) => {
    // const busqueda = req.body.busqueda
    const idUsuario = req.params.id;
     const pedidos = await Pedido.find({usuarioRepartidor:idUsuario});
     const cantidadTotalDePedidos = await Pedido.countDocuments({usuarioRepartidor:idUsuario}).exec();
     res.render('pedidos/pedidoIndividual', { pedidos, cantidadTotalDePedidos });
  
 
 
 }))

//mostrar todos los pedidos realizados

router.get('/pedidos-todos',isLoggedIn , catchAsync(async (req, res) => {
    // const busqueda = req.body.busqueda
     console.log(req.user.funcion)
     const repartidor = req.user;
     const pedidos = await Pedido.find({});
     const cantidadTotalDePedido = await Pedido.countDocuments({}).exec();
     res.render('pedidos/verTodosLosPedidos', { pedidos, cantidadTotalDePedido,repartidor });
    
    
    
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