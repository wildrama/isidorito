const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, isCaja } = require('../middleware');
const EstacionDeCobro = require('../models/estaciondecobro');
const CierreCaja = require('../models/cierrecaja');




const roleADM = 'ADMINISTRADOR';
const roleCaja = 'CAJA';

// isLoggedIn,isAdmin(roleADM),

// mostrar los Cierres
router.get('/', async (req, res) => {
  try {
    console.log(req.user.funcion)

  console.log('cierresTODOS:')
    const cierresDeCaja = await CierreCaja.find({}).populate('estacionDeCobro');
  console.log(cierresDeCaja)
    res.render('panelCierres/verTodosLosCierres', { cierresDeCaja })
  } catch (error) {
    console.log(error)
    req.flash('error','No es posible acceder a los cierres, porfavor Intenta denuevo')
    res.redirect('/administrador')
  }
  
});


router.get('/:id', catchAsync(async (req, res) => {
  try {
    const id = req.params.id;
    const cierreDeCajaRealizadoIndividual = await CierreCaja.findById(id).populate('estacionDeCobro').exec()
    // const ventasDeEstaEstacion = await Venta.find({estacionDeCobro:mongoose.Types.ObjectId(id)}). 


    // let dineroTotal = 0;
    // let arrayVentas = estacionDeCobro.ventasRealizadasEnLaEstacion;
    // arrayVentas.map( datoVenta =>{
    //   dineroTotal = dineroTotal + datoVenta.dineroIngresado;
    // dineroParcialSumado = dineroTotal
    // })
    res.render('panelCierres/verCierreIndividual', { cierreDeCajaRealizadoIndividual })
  } catch (error) {
    req.flash('error', 'No se puede visualizar el cierre')

    res.redirect('/administrador/cierres-caja')

  }

}))


 


// agregar ofertas a la estación
module.exports = router;

