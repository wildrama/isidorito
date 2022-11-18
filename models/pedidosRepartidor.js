const mongoose = require('mongoose');
const {Schema} = mongoose;
const Producto = require('./productos');
const Cliente = require('./clientes');

// fecha de salida
const pedidosSchema = new Schema ({

 clienteNombre:{
    type:String
},
cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente'
 },
productosPedidos:[
 {
    type: Schema.Types.ObjectId,
    ref: 'Producto'
 }
],
productoCantidad:{
    idString: String,
    cantidadDeUnMismoProducto: Number
},
productosPedidosNombre:[],
productosPedidosCantidad:[],
estadoDePedido:String,

cantidadDeProductos:Number,

importeTotal:Number,



}, { timestamps: true });     
const Pedido = mongoose.model('Pedido', pedidosSchema);

module.exports = Pedido;
