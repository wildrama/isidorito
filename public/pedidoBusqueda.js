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
let productosAgregadosArr = []
let productosParaElPedido = [];
 const todosLosMas = document.querySelector('agregarUnElementoAlaLista')


formBuscarPedidos.addEventListener("keypress", async function(e){

  const query_buscar = e.target.value;
  displayProductos.innerHTML = "";
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

      
      let cantidadElegida = 0;
      let idArray = [];
      console.log(productosAgregadosArr)
      // console.log(idP.textContent)
      divPlus.addEventListener('click',async (e)=>{

        // for(let rowsActual of tableParaProductosP.children){

        // }
        cantidadElegida += 1;

        
          
       if(cantidadElegida < 2){
        
        // idArray.push(producto._id)
          productosAgregadosArr.push({
            id : producto._id,
            nombre: producto.nombre,
            marca:producto.marca,
            precioMayorista: producto.precioMayorista,
            cantidad: cantidadElegida
          })
          console.log(productosAgregadosArr)
          // let productoAAgregar = e.target.id;  
          // console.log(productoAAgregar)
          // var cartItemNombre = producto.nombre;
          // var cartItemMarca = producto.marca;
          // var cartItemPrecio = producto.precioMayorista;
  
          
          // console.log(cartItemNombre,cartItemMarca,cartItemPrecio)        
  
          
          // tdProductoRowCantidadProducto.id = `${producto._id}c`
          // tdProductoRowPrecioProducto.id = `${producto._id}p`
          tableParaProductosP.innerHTML = "";
          mostrarProductosAgregados()

       }else{
        let precioParcialProducto = producto.precioMayorista * cantidadElegida;
        // tdProductoRowCantidadProducto.innerHTML = ;
        // tdProductoRowPrecioProducto.innerHTML = ; 
        
        // tdCantidadElegida.innerHTML =tdCantidadElegida;
        // tdPrecio.innerHTML = precioParcialProducto
        console.log(cantidadElegida + 'producto añadido sin repetir' + precioParcialProducto)
        
        // const updatedData = productosAgregadosArr.map(x => (x.id === producto._id ? { ...x, cantidad: cantidadElegida } : x));
        var data = productosAgregadosArr.find(function(ele) {
          return ele.id === producto._id;
      });
      console.log(data)
      data.cantidad = data.cantidad+ 1;
      data.precioMayorista = precioParcialProducto
      console.log('producto ya existente')
       for(let pa of productosAgregadosArr){
        console.log(pa.nombre)

        console.log(pa.cantidad)

       } 
       tableParaProductosP.innerHTML = "";
       mostrarProductosAgregados()
        // if (productosAgregadosArr.find(p => p.id == producto._id)) {
        //   /* vendors contains the element we're looking for */
        //   console.log('producto existente' )
        //   // let productoAAG={
        //   //   id : producto._id,
        //   //   nombre: producto.nombre,
        //   //   marca:producto.marca,
        //   //   precioMayorista: precioParcialProducto,
        //   //   cantidad: cantidadElegida
        //   // }
        //   // productosAgregadosArr.pop();
        //   // console.log(productosAgregadosArr)

        //   // tdProductoRowCantidadProducto.innerHTML = cantidadElegida;
        //   // tdProductoRowPrecioProducto.innerHTML = precioParcialProducto;
        // }
        
       }
      
       divCantidadActual.innerHTML = cantidadElegida;
       console.log(productosAgregadosArr)
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

const mostrarProductosAgregados =  () =>{
  productosAgregadosArr.forEach( productoRow =>{


    let rowProductoRow = document.createElement('tr')
    let tdProductoRowAccion = document.createElement('td');
    let tdProductoRowNombreProducto = document.createElement('td');
    let tdProductoRowCantidadProducto = document.createElement('td');
    let tdProductoRowPrecioProducto = document.createElement('td');


    tdProductoRowAccion.innerHTML = "x x"
    tdProductoRowNombreProducto.innerHTML= `${productoRow.nombre}--${productoRow.marca}`;

    tdProductoRowCantidadProducto.innerHTML = productoRow.cantidad;
    tdProductoRowPrecioProducto.innerHTML = productoRow.precioMayorista;
    tableParaProductosP.append(rowProductoRow);
    rowProductoRow.append(tdProductoRowAccion,tdProductoRowNombreProducto,tdProductoRowCantidadProducto,tdProductoRowPrecioProducto)
   

  })
  
  // construir tabla en base al array productosAgregadosArr  mostrarProductosAgregados()

  // corregir errores de tabla dinamica
}


  }


   
   

  
      } catch (error) {

 
        inputBuscar.value="";

     inputBuscar.focus();
      
      //   alerP.classList.remove('d-none')
      //   setTimeout(() => {
      // alerP.classList.add('d-none')
      //     }, 3000)
  }


 console.log(productosParaElPedido)  
 
 
});




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


