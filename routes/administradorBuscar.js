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
  // Ruta para buscar por código de barras
router.get('/buscar-por-codigo-de-barras/:codigoDeBarras', async (req, res) => {
  const { codigoDeBarras } = req.params;
  try {
    const producto = await Producto.findOne({codigo: codigoDeBarras });
    if (!producto) {
      return res.status(404).json({ message: 'No se encontró ningún producto con ese código de barras.' });
    }
    return res.json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al buscar el producto.' });
  }
});


// Ruta para buscar por texto
router.get('/buscar-por-texto/:busqueda', async (req, res) => {
  const { busqueda } = req.params;

  try {

   
        const productos = await Producto.find({
          $or: [
            { nombre: { $regex: busqueda, $options: 'i' } },
            { marca: { $regex: busqueda, $options: 'i'} },
          ],
        });
        res.json(productos);


    // const searchText = req.query.q;
    // if (searchText) {
    //   const filteredProducts = await Producto.find({ nombre: { $regex: busqueda, $options: 'i' } });
    //   res.json(filteredProducts);
    // } else {
    //   const allProducts = await Producto.find();
    //   res.json(allProducts);
    // }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al buscar los productos.' });
  }
});
  router.get('/productosb', async (req, res) => {
    const searchText = req.query.q;
    if (searchText) {
      const filteredProducts = await Producto.find({ nombre: { $regex: searchText, $options: 'i' } });
      res.json(filteredProducts);
    } else {
      const allProducts = await Producto.find();
      res.json(allProducts);
    }
  });



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
