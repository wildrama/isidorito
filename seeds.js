const mongoose = require('mongoose');
const Producto = require('./models/productos');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/dbProductos');
  console.log("everything abot db is OK")
}

// const prod = Producto({
//     nombre:'Chocolino cacao',
//     cantidad:50,
//     marca:'la virginia',
//     valor:120,
//     impuestoAplicado:21
// })
// prod.save()
// .then(prod=>{
//     console.log(prod)
// })
// .catch(e=>{
//     console.log(e)
// })

const seedProds = [{
    nombre:'Fideos Marolio',
    cantidad:30,
    marca:'Marolio',
    valor:650
},
{
    nombre:'Chocolino cacao',
    cantidad:50,
    marca:'la virginia',
    valor:120
},
{
    nombre:'uvita tinto',
    cantidad:50,
    marca:'baggio',
    valor:190
},
{
    nombre:'pañales huggies',
    cantidad:150,
    marca:'pañales',
    valor:300
},
{
    nombre:'Salsa de tomate marolio',
    cantidad:90,
    marca:'marolio',
    valor:40
},
]
Producto.insertMany(seedProds)
.then(res =>{
    console.log(res)
})
.catch(e=>{
    console.log(e)
})
