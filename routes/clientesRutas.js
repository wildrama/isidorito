const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isCaja } = require('../middleware');
const Pedidos = require('../models/pedidosRepartidor');
const Clientes = require('../models/clientes');

// const RoleRep = "REPARTIDOR";
// isAdmin(roleADM),
// render formulario para agregar cliente

router.get('/agregar-cliente', isLoggedIn, catchAsync(async (req, res) => {
   const usuario = req.user.funcion;
    
    res.render('clientes/agregarCliente',{usuario});
  }))

// agregar cliente a la bbdd
router.post('/agregar-cliente',catchAsync(async(req,res)=>{
    const nuevoCliente = new Clientes(req.body);
    await nuevoCliente.save();
    console.log(nuevoCliente);
    req.flash('success','Nuevo cliente agregardo correctamente')
    res.redirect(`/clientes/${nuevoCliente._id}`)



}))


// ver Todos los clientes de ser necesario
router.get('/clientes-todos', catchAsync(async(req,res)=>{
    const todosLosClientes = await Clientes.find({});

    res.render('clientes/verTodosLosClientes',{todosLosClientes});
}))

// ver cliente individual

router.get('/:id', catchAsync(async(req,res)=>{
    const idCliente = req.params.id;

    const clienteIndividual = await Clientes.findById(idCliente);


    res.render('clientes/clienteIndividual',{clienteIndividual})
}))

// editar info de cliente



// eliminar cliente




module.exports = router;