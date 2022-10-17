const express = require('express');
const app = express();
const port = 3011;
const mongoose = require('mongoose');

const path = require('path');

const methodOverride = require('method-override')

const flash = require('connect-flash');

// session
const session = require('express-session');
const MongoStore = require('connect-mongo');

// passport
const passport = require('passport');
const LocalStrategy = require('passport-local');


// require mongoose models
const User = require('./models/usuario.js')
const ExpressError=require('./utils/ExpressError');




const dbUrl = 'mongodb://localhost:27017/dbEscososa';
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("everything abot db is OK")
}

const store = new MongoStore({
  mongoUrl: dbUrl,
  secret:'thisNot',
  touchAfter:24*60,
})

store.on("error", function(e){
  console.log('error on session store',e)
})
const sessionConfig = {
  store,
  name:'session',
  secret: 'this!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
// sessionMiddleware
app.use(session(sessionConfig)); 

const ingresos = require('./routes/ingresos')
const cajaRoutes= require('./routes/cajaRegular')
const admCaja = require('./routes/cajaAdministrador')
const loginRoutes = require('./routes/usuarios')
const administradorUsuariosRoutes = require('./routes/administradorUsuarios');
const administradorProductosRoutes =require('./routes/administradorProductos');
const administradorBuscarRoutes =require('./routes/administradorBuscar');
const administradorEstacionDeCobroRoutes  = require('./routes/administradorEstaciones');
const administradorOfertasRoutes =require('./routes/administradorOfertas');
const administradorCierresDeCajaRoutes =require('./routes/administradorCierreDeCaja');

const busquedaNombre = require('./routes/buscarProd');
const codigoBarra = require('./routes/codigoBarra');
 
const saveVentasRoutes = require('./routes/savesDeCaja')


// const stockRoutes = require('./routes/stock')

app.use(express.json());

// statics files
app.use(express.static('public'));
app.use(express.static('files'));

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))



app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// flash Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})



app.use('/',loginRoutes);
app.use('/administrador/productos',administradorProductosRoutes);
app.use('/administrador/userpanel',administradorUsuariosRoutes);
app.use('/administrador/estacionesdecobro',administradorEstacionDeCobroRoutes);
app.use('/administrador/cierres-caja',administradorCierresDeCajaRoutes);

app.use('/caja',cajaRoutes);
app.use('/administrador/caja', admCaja)
app.use('/administrador/buscar',administradorBuscarRoutes);
app.use('/administrador/ofertas',administradorOfertasRoutes)
app.use('/buscanombre', busquedaNombre)
app.use('/codigobarra', codigoBarra)
app.use('/', ingresos)

app.use('/save', saveVentasRoutes);

// RENDER HOME
app.get('/', (req, res) => {
    res.render('index');
})        

// error midller ware base
app.all('*', (req, res, next) => {
  next(new ExpressError('Esta pagina no existe. Vuleve al Inicio', 404))
})


app.use(function (err, req, res, next) {
  const { statusCode = 500 } = err;
  console.log(err);
     
  

    if (!err.message) err.message = 'Algo salio mal!'
  res.status(statusCode).render('errors',)
}); 

// endapp
app.listen(port, () => console.log(`SISTEMA DE GESTION ESCOSOSA v.0.0.0.0 ${port}!`))

