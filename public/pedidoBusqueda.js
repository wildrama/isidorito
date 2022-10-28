const inputBuscar = document.querySelector('#inputIrBuscar');


const pul = document.querySelector('#pulBuscarProducto');
const tableParaProductosP = document.querySelector('#tableParaProductosP');
const lupa = document.querySelector('#lupaBusqueda')


const buscarproducto = document.querySelector('#buscarproducto');
const formSearch = document.querySelector('#formSearch');
const formSearchCodigo = document.querySelector('#formSearchCodigo');

const buscarcodigo = document.querySelector('#buscarcodigo');
const alertP = document.querySelector('#alertP');


lupa.addEventListener('click', async function(event){


  try {
    const query_buscar = inputBuscar.value;
    console.log(query_buscar)
    const res = await axios.post('/pedidos/buscar-productos', {codigo: query_buscar }); 
    const productos = res.data;
    

    console.log(res.data)  
    if(producto._id){
      const td0 = document.createElement('td');
      const td1 = document.createElement('td');

      const td2 = document.createElement('td');

      const td3 = document.createElement('td');

      const td4 = document.createElement('td');

      const tr = document.createElement('tr');

      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const li2 = document.createElement('li');
      const accion1 = document.createElement('a');
      const imgButton1 = document.createElement('img');
      const accion2 = document.createElement('a');

        accion1.href =`/administrador/productos/${producto._id}/upstockprecio`;
        imgButton1.classList.add('editButton')
          imgButton1.src='/imgs/png/contract.png'
      td1.textContent= producto.precioMinorista;
      td0.textContent= producto.nombre;
      td2.textContent= producto.marca;
      td3.textContent= producto.cantidad;
      accion1.append(imgButton1);
      tr.append(td0,td1,td2,td3,accion1)
      tableBody.append(tr);

      inputBuscar.value="";
      
    inputBuscar.focus();

    }
   
    inputBuscar.value="";

  
      } catch (error) {

 
        inputBuscar.value="";

     inputBuscar.focus();
      
        alerP.classList.remove('d-none')
        setTimeout(() => {
      alerP.classList.add('d-none')
          }, 3000)
  }
 
})
inputBuscar.addEventListener('click', function(){
    console.log('click')
})

