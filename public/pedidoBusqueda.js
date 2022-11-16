const inputBuscar = document.querySelector('#inputIrBuscar');

const displayProductos = document.querySelector('#displayProductos');

const pul = document.querySelector('#pulBuscarProducto');
const tableParaProductosP = document.querySelector('#tableParaProductosP');
const lupa = document.querySelector('#lupaBusqueda')


const buscarproducto = document.querySelector('#buscarproducto');
const formSearch = document.querySelector('#formSearch');
const formBuscarPedidos = document.querySelector('#formBuscarPedidos');
const buscarcodigo = document.querySelector('#buscarcodigo');
const alertP = document.querySelector('#alertP');

let productosParaElPedido = [];
 const todosLosMas = document.querySelector('agregarUnElementoAlaLista')


formBuscarPedidos.addEventListener("submit", async function(e){
e.preventDefault();
  const query_buscar = inputBuscar.value;

  console.log(query_buscar) 
  
  try {
    // console.log(query_buscar)
    const res = await axios.get(`/pedidos/buscar-productos?busqueda=${query_buscar}`); 
    const productos = res.data;
    
    productosParaElPedido.push(productos)

    for(let producto of productos){
        console.log(producto.nombre)

      
      
      const col9 = document.createElement('div');
      const rowProd = document.createElement('div');

      const divNombre = document.createElement('div');
      const divMarca = document.createElement('div');
      const divPrecioM = document.createElement('div');
      const divPrecioU = document.createElement('div');

      const col3 = document.createElement('div');

      const divMinus = document.createElement('div');
      const divCantidadActual = document.createElement('div');

      const divPlus = document.createElement('div');
      const idP = document.createElement('p');

      rowProd.classList.add('row', 'mb-1','border', 'border-info')
      col9.classList.add('col-9', 'd-flex', 'justify-content-between', 'text-center')
      col3.classList.add('col-3','d-flex' , 'justify-content-end', ',align-items-center')
      divCantidadActual.classList.add('px-3')
      idP.classList.add('d-none');
      divPlus.classList.add('agregarUnElementoAlaLista')
    //     accion1.href =`/administrador/productos/${producto._id}/upstockprecio`;
    //     imgButton1.classList.add('editButton')
    //       imgButton1.src='/imgs/png/contract.png'
      divNombre.textContent= producto.nombre;
      divMarca.textContent= producto.marca;
      divPrecioM.textContent= producto.precioMayorista;
      idP.textContent = producto._id;
      divMinus.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
    </svg>`;
      divCantidadActual.innerHTML = 0,
      divPlus.innerHTML=`<svg id="${producto._id}"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>`;
      //   accion1.append(imgButton1);
    //   tr.append(td0,td1,td2,td3,accion1)

    //   tableBody.append(tr);
    col9.append(divNombre,divMarca,divPrecioM);
    col3.append(divCantidadActual,divPlus)
    rowProd.append(col9,col3);
      displayProductos.append(rowProd);

      const productoAgregado = {
        id: producto._id,
        nombre: producto.nombre,
        marca: producto.nombre,
        precio: producto.nombre,
        cantidad: producto.cantidad,

      }
      let cantidadElegida = 0;
      let idArray = [];

      // console.log(idP.textContent)
      divPlus.addEventListener('click',async (e)=>{

        // for(let rowsActual of tableParaProductosP.children){
        
        // }

        cantidadElegida += 1;
        divCantidadActual.innerHTML = cantidadElegida;
        console.log(cantidadElegida)
        
        let rowProductoRow = document.createElement('tr')
          let tdProductoRowAccion = document.createElement('td');
          let tdProductoRowNombreProducto = document.createElement('td');
          let tdProductoRowCantidadProducto = document.createElement('td');
          let tdProductoRowPrecioProducto = document.createElement('td');

       if(cantidadElegida < 2){
        // idArray.push(producto._id)
           
        console.log(idArray)
  
          
          let productoAAgregar = e.target.id;  
          console.log(productoAAgregar)
          var cartItemNombre = producto.nombre;
          var cartItemMarca = producto.marca;
          var cartItemPrecio = producto.precioMayorista;
  
          
          console.log(cartItemNombre,cartItemMarca,cartItemPrecio)        
  
          
          // tdProductoRowCantidadProducto.id = `${producto._id}c`
          // tdProductoRowPrecioProducto.id = `${producto._id}p`

          tdProductoRowAccion.innerHTML = "adsd"
           tdProductoRowNombreProducto.innerHTML= `${producto.nombre}-${producto.marca}`;

           tdProductoRowCantidadProducto.innerHTML = cantidadElegida;
           tdProductoRowPrecioProducto.innerHTML = producto.precioMayorista;
           tableParaProductosP.append(rowProductoRow);
           rowProductoRow.append(tdProductoRowAccion,tdProductoRowNombreProducto,tdProductoRowCantidadProducto,tdProductoRowPrecioProducto)
          

       }else{
        let precioParcialProducto = producto.precioMayorista * cantidadElegida;
        // tdProductoRowCantidadProducto.innerHTML = ;
        // tdProductoRowPrecioProducto.innerHTML = ; 
        
        // tdCantidadElegida.innerHTML =tdCantidadElegida;
        // tdPrecio.innerHTML = precioParcialProducto
        console.log(cantidadElegida + 'producto añadido sin repetir' + precioParcialProducto)
        

       }
    
        // if (idArray.includes(e.target.id)){
        //   console.log('Ya existe')
        //  }else{
        //   console.log('primerProductoAgregado')
        //  }
        // var imageSrc = cartItem.getElementsByClassName('product-image')[0].src;
        // addItemToCart (price, imageSrc);
        // updateCartPrice()
        
      
      })



      // 
//   //For every image check if url has filter in it and hide/show as needed.
//   for (let i = 0; i < productos.length; $i++) {

//     if ($imgsCollection[$i].getAttribute('src').indexOf($filter) > -1) {

//         $imgsCollection[$i].style.display = 'block';
//     } else {

//         $imgsCollection[$i].style.display = 'none';

//     }
//  }

const mostrarProductosAgregados = () =>{

  productosParaElPedido.forEach( productoRow =>{
    var cartItem = button.parentElement;



    for(let p; p < productosParaElPedido.length; p++){

          
    const rowProductoRow = document.createElement('tr')
    const tdProductoRowAccion = document.createElement('td');
    const tdProductoRowNombreProducto = document.createElement('td');
    const tdProductoRowCantidadProducto = document.createElement('td');
    const tdProductoRowPrecioProducto = document.createElement('td');


    
    }




  })
  
  


}


  }


   
   

  
      } catch (error) {

 
        inputBuscar.value="";

     inputBuscar.focus();
      
        alerP.classList.remove('d-none')
        setTimeout(() => {
      alerP.classList.add('d-none')
          }, 3000)
  }


 console.log(productosParaElPedido)  
 console.log(todosLosMas);  
 
});
console.log(todosLosMas);  



const mostrarProductosAgregados = () =>{


  
    var table = document.getElementById('emptbl');
    var rowCount = table.rows.length;
    var cellCount = table.rows[0].cells.length; 
    var row = table.insertRow(rowCount);
    for(var i =0; i <= cellCount; i++){
      var cell = 'cell'+i;
      cell = row.insertCell(i);
      var copycel = document.getElementById('col'+i).innerHTML;
      cell.innerHTML=copycel;
      if(i == 3){ 
        var radioinput = document.getElementById('col3').getElementsByTagName('input'); 
        for(var j = 0; j <= radioinput.length; j++) { 
          if(radioinput[j].type == 'radio') { 
            var rownum = rowCount;
            radioinput[j].name = 'gender['+rownum+']';
          }
        }
      }
    }
 

}

const agregarProductoAlPedido = ()=>{

  productosParaElPedido.forEach( p => {
    let ip = {
      id : p._id,

    }
  })
}

document.getElementById('eliminarProductos').addEventListener('click', function(){
  var table = document.getElementById('emptbl');
  var rowCount = table.rows.length;
  if(rowCount > '2'){
    var row = table.deleteRow(rowCount-1);
    rowCount--;
  }
  else{
    alert('There should be atleast one row');
  }
  console.log(productosParaElPedido)
  inputBuscar.value= "";

  inputBuscar.focus();

  displayProductos.innerHTML = "";
})


