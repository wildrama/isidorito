const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAdmin} = require('../middleware');
const Producto = require('../models/productos');




const roleADM = 'ADMINISTRADOR';


// RENDER VER TABLA DE STOCK
router.get('/',isLoggedIn ,isAdmin(roleADM), catchAsync(async (req, res) => {

    console.log(req.user.funcion)
    const productos = await Producto.find({})
  
    res.render('stock/verStock', { productos });
 


}))
// }

//  CREATE {
// RENDER FORMULARIO DE CARGA DE STOCK

router.get('/nuevo', isLoggedIn,isAdmin(roleADM), (req, res) => {
  console.log(req.user, 'req.user....');

  res.render('stock/cargaStock');
})
// ENVIAR DATOS DEL FORMULARIO A LA BBDD

router.post('/',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  req.flash('success', 'Producto cargado correctamente correctamente');

  res.redirect(`/administrador/productos/${nuevoProducto._id}`)
}))

// }


// UPDATE {
// ACTUALIZAR UN PRODUCTO DEL STOCK
// poblate the products with the form and values
router.get('/:id/edit',isLoggedIn, isAdmin(roleADM), catchAsync(async (req, res) => {

  const { id } = req.params;
  const producto = await Producto.findById(id);
  if (!producto) {
    req.flash('error', 'No se puede encontrar la este producto');
}
  res.render('stock/stockIndividual', { producto })
}))






// ENVIAR PUT REQUEST




router.put('/:id',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, marca, precioMinorista, precioMayorista, precioCosto, categoria, peso, fechaDeVencimiento, impuestoAplicado} = req.body
  const producto = await Producto.findByIdAndUpdate(id, {
	  nombre: nombre,
	 cantidad: cantidad,
	  marca: marca,
	  precioMinorista: precioMinorista,
	  precioMayorista: precioMayorista,
	  precioCosto: precioCosto, 
	  categoriaInterna: categoria,
	  impuestoAplicado: impuestoAplicado,
	  fechaDeVencimiento: fechaDeVencimiento,
	  peso: peso,
	  fechaDeVencimiento: fechaDeVencimiento
  },
		{ runValidators: true });
            res.json(producto)	

  if (!producto) {
    req.flash('error', 'No se puede encontrar editar el producto');
    return res.redirect('/administrador/productos');
}
 

}))





//


// ENVIAR PUT REQUEST PRECIO




router.put('/precmin/:id',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const { id } = req.params;
  const {precioMinorista} = req.body
  const producto = await Producto.findByIdAndUpdate(id, {
	  precioMinorista: precioMinorista
  },
		{ runValidators: true });

             res.json(producto)

  if (!producto) {
    req.flash('error', 'No se puede encontrar editar el producto');
     res.redirect('/administrador/productos');
}
 

}))



//


//


// ENVIAR PUT REQUEST PRECIO




router.put('/precmay/:id',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const { id } = req.params;
  const {precioMayorista} = req.body
  const producto = await Producto.findByIdAndUpdate(id, {
	  precioMayorista: precioMayorista
  },
		{ runValidators: true });

             res.json(producto)

  if (!producto) {
    req.flash('error', 'No se puede encontrar editar el producto');
    return res.redirect('/administrador/productos');
}
 

}))



//



//


// ENVIAR PUT REQUEST PRECIO




router.put('/preccos/:id',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const { id } = req.params;
  const {precioCosto} = req.body
  const producto = await Producto.findByIdAndUpdate(id, {
	  precioCosto: precioCosto
  },
		{ runValidators: true });
             res.json(producto)

  if (!producto) {
    req.flash('error', 'No se puede encontrar editar el producto');
    return res.redirect('/administrador/productos');
}
 

}))



//



// }


//EDITAR STOCK INDIVIDUAL

router.get('/:id/upstock', isLoggedIn,isAdmin(roleADM),catchAsync(async (req, res) => {
  const {id} = req.params;
	const producto = await Producto.findById(id)
	if (!producto) {
		
	}
  res.render('edit/editResponsive.ejs', {producto})
}))

router.get('/:id/upstockprecio', isLoggedIn,isAdmin(roleADM),catchAsync(async (req, res) => {
  const {id} = req.params;
	const producto = await Producto.findById(id)
	if (!producto) {
		
	}
  res.render('edit/editPrecio.ejs', {producto})
}))

// RENDER STOCK INDIVIDUAL
router.get('/:id', isLoggedIn,isAdmin(roleADM),catchAsync(async (req, res) => {
  
  const { id } = req.params;
  const producto = await Producto.findById(id)
  if (!producto) {
    req.flash('error', 'No se puede encontrar el producto');
    return res.redirect('/administrador/productos');
}
  res.render('stock/stockIndividual', { producto });
}))


// BORRAR STOCK INDIVIDUAL

router.delete('/:id',isLoggedIn,isAdmin(roleADM), catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedProducto = await Producto.findByIdAndDelete(id);
  if (!deletedProducto) {
    req.flash('error', 'No se puede eliminar el producto');
    return res.redirect('/administrador/productos');
}
  res.redirect('/administrador/productos');
}))






module.exports = router;
