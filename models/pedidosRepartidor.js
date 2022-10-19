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
productosPedidosNombre:[String],
productosPedidosCantidad:[Number],
estadoDePedido:String,

cantidadDeProductos:Number,

importeTotal:Number,

usuarioRepartidor:{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
}

}, { timestamps: true });     
const Pedidos = mongoose.model('Pedido', pedidosSchema);

module.exports = Pedidos;
