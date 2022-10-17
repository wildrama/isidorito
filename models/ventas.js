const mongoose = require('mongoose');
const EstacionDeCobro = require('./estaciondecobro');
const Producto = require('./productos');
const { Schema } = mongoose;
const Usuario = require('./usuario')
// fecha de salida
const ventasEfectuadasSchema = new Schema({
    dineroIngresado: {
        type: Number
    },
    dineroDeSalida: {
        type: Number
    },
    productosDeStock: [
        {
            valorDelProductoEnLaCompra:
            {
                type: String
            },
            identificadorDeProducto:
            {
                type: Schema.Types.ObjectId,
                ref: Producto
            }
        }
    ]
    ,
    productosSinStock: [
        {
            valorDelProductoEnLaCompra:
            {
                type: String
            },
            identificadorDeProducto:
            {
                type: String
            }
        }
    ]
    ,
    ticketEntregado: {
        type: String,
        enum:['SI', 'NO'],
        required:true,
    },
    tipoDePago:{
        type: String,
        enum:['EFECTIVO', 'OTRO'],
        required:true,
    },
    cantidadDeProductosTotales: {
        type: Number
    },
    estacionDeCobro: 
        {
            type: Schema.Types.ObjectId,
            ref: 'EstacionDeCobro'
        }
    ,
    nombreDelUsuario:{
        type:String
    }

}, { timestamps: true });

const Venta = mongoose.model('Venta', ventasEfectuadasSchema);

module.exports = Venta


// ACCIONES DURANTE LA VENTA Y GUARDAR VENTA. EL RESTO ISIIIII