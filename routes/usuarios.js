const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,logAdmin,logCaja} = require('../middleware');
const Producto = require('../models/productos');
const User = require('../models/usuario');


const passport = require('passport');
// crear usuario
 router.get('/registro', catchAsync(async (req, res) => {
  // const user = new User({ funcion: 'CAJA', username: 'caja' })
  // const nuevoUser = await User.register(user, '123456')
  // console.log(user)
  
  // res.send('registrado')
}))




router.get('/ingresar', (req, res) => {
  res.render('home');
})

router.post('/ingresar', passport.authenticate('local', { failureFlash: true, failureRedirect: '/ingresar' }),  (req, res) => {
if(req.user.funcion){
  const role = req.user.funcion;
  switch( role) {
      case 'ADMINISTRADOR': 
        // code block
        const redirectUrl = req.session.returnTo || '/administrador';

        console.log('Haz iniciado como', role)
        delete req.session.returnTo;

        res.redirect(redirectUrl)
        break;
      case 'CAJA':
          console.log('Haz iniciado como', role)
          const redirectUrl2 = req.session.returnTo || '/ingreso-caja';
          delete req.session.returnTo;

          return res.redirect(redirectUrl2);     
            

  }
  
} else{
  
  return res.redirect('/ingresar');       


}

})


router.get('/cerrar-sesion', (req,res)=>{
  req.logOut();
  req.flash('success','Sesión cerrada correctamente')
  res.redirect('/')
})



router.get('/crearAdmin1', async( req, res)=>{
  const usuario = new User({funcion:'ADMINISTRADOR', username:'escososa'});
  const nuevoUsuario = await User.register(usuario,'admescososa2022');
  req.flash('success','Usuario creado correctamente');
  
  res.redirect('/');
})


// app.get('/crearAdmin1', async( req, res)=>{
//   const usuario = new User({funcion:'ADMINISTRADOR', username:'escososa'});
//   const nuevoUsuario = await User.register(usuario,'admescososa2022');

//   console.log(nuevoUsuario);
//   res.send(nuevoUsuario)
// })
// app.get('/crearAdmin2', async( req, res)=>{
//   const usuario = new User({funcion:'ADMINISTRADOR', username:'yaelsosa'});
//   const nuevoUsuario = await User.register(usuario,'admyael2022')

//   console.log(nuevoUsuario);
//   res.send(nuevoUsuario)
// })
// app.get('/crearAdmin3', async( req, res)=>{
//   const usuario = new User({funcion:'ADMINISTRADOR', username:'francososa'});
//   const nuevoUsuario = await User.register(usuario,'admfranco2022')

//   console.log(nuevoUsuario);
//   res.send(nuevoUsuario)
// })

// app.get('/crearCaja4', async( req, res)=>{
//   const usuario = new User({funcion:'CAJA', username:'cajaescososa'});
//   const nuevoUsuario = await User.register(usuario,'cajaescososa2022')

//   console.log(nuevoUsuario);
//   res.send(nuevoUsuario)
// })

// app.get('/crearAdmin2', async( req, res)=>{
//   const usuario = new User({funcion:'ADMINISTRADOR', username:'yaelsosa'});
//   const nuevoUsuario = await User.register(usuario,'admyael2022')

//   console.log(nuevoUsuario);
//   res.send(nuevoUsuario)
// })
// app.get('/crearcaja', async( req, res)=>{
//   const usuario = new User({funcion:'ADMINISTRADOR', username:'123'});
//   const nuevoUsuario = await User.register(usuario,'123')

//   console.log(nuevoUsuario);
//   res.send('nuevoUsuario')
// })


module.exports = router;
