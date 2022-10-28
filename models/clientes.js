const mongoose = require('mongoose');
const {Schema} = mongoose;
const Pedidos = require('./pedidosRepartidor');

const clienteSchema = new Schema ({

    nombreLocal:{
       type:String
   },
   dueño:String,
   direccion:String,

   telefono1:Number,
   telefono2:Number,
   telefono3:Number,
   correo:String,
   comentario:String,
   pedidosRealizados:[
    {
       type: Schema.Types.ObjectId,
       ref: 'Pedidos'
    }
   ]
 
   
   
   }, { timestamps: true });     
   const Clientes = mongoose.model('Cliente', clienteSchema);
   
   module.exports = Clientes;
   