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
    const idRepartidorActual = req.user
    res.render('pedidos/crearPedido',{clientesActuales,fechaHoy,idRepartidorActual});
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
     console.log('TODOS LOS PEDIDOS')
     const repartidor = req.user;
     const pedidos = await Pedido.find({}).populate('cliente').exec();
     const cantidadTotalDePedido = await Pedido.countDocuments({});
     for(let ped of pedidos){
        console.log('el pedido es '+ped)

     }
     res.render('pedidos/verTodosLosPedidos', { pedidos, cantidadTotalDePedido,repartidor });
    
    
    
 }))
 router.get('/todos-axios', catchAsync(async (req, res) => {
    try {
           // const busqueda = req.body.busqueda
     console.log('TODOS LOS PEDIDOS')
     const pedidos = await Pedido.find({}).populate('cliente').exec();
    const fechaRegistroPedido = Date.now()
     res.send({ pedidos,fechaRegistroPedido });
    
    } catch (error) {
        res.send({ error });

    }
 
    
    
 }))
 router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const eliminarPedido = await Pedido.findByIdAndDelete(id);
    if (!eliminarPedido) {
      req.flash('error', 'No se puede eliminar pedido');
      return res.redirect('/pedidos/pedidos-todos');
  }s
  req.flash('success', 'Pedido Eliminado');

    res.redirect('/pedidos/pedidos-todos');
    
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
// post del pedido

router.post('/save-pedido', catchAsync(async(req,res)=>{
    console.log(req.body)
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save()
    req.flash('success','Nuevo pedido realizo correctamente')
    console.log(nuevoPedido)
    
    // res.redirect(`/pedidos/${nuevoProducto._id}`)
    res.redirect('/pedidos/crear-pedido');
}))
// editar un pedido en especifico


// marcar como "ENTREGADO" a un pedido


// imprimir Pedido

// router.get('/pedidos/stockMayorista', catchAsync(async(res,res)=>{
//     const todosLosPedidos = await Pedido.find({})
//     console.log(todosLosPedidos)

//     res.render('pedidos/verTodosLosPedidos')
// }))
module.exports = router;