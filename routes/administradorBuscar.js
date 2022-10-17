const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAdmin} = require('../middleware');
const Producto = require('../models/productos');
const User = require('../models/usuario');


const passport = require('passport');


const roleADM = 'ADMINISTRADOR';



router.get('/', isLoggedIn, isAdmin(roleADM),(req,res)=>{
  res.render('stock/listado')
})


router.post('/',  async(req,res)=>{
    try {
      const codigo = req.body.codigo;
      
     
      const producto = await Producto.findOne({codigo: codigo });
      res.json(producto);    
    } catch (error) {
        res.send('error')
    } 
    
  })
  
  router.post('/buscar-codigo', isLoggedIn,catchAsync( async (req, res) => {
    try {
        
      const codigo = req.body.codigo;
      console.log(codigo);
      const producto = await Producto.findOne({codigo: codigo });
      res.json(producto);   
    } catch (error) {
      console.log(error) ;
        res.send('error')
      

    } 
    

  }))
  
  
router.post('/mixto', isLoggedIn, async(req,res)=>{
    const query = req.body.buscar;
    console.log(query);
    try {
  
        const productos = await Producto.find({
           $or:[
             {nombre:{$regex: query}},
             {marca:{$regex: query}},
	     {codigo:{$regex: query}}	   
  
           ]
             });
  
  
             console.log(productos);
             res.json(productos)
  
    } catch (error) {
        res.send('error')
    }
  })



module.exports = router;
