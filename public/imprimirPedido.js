console.log('pedido impreso')


const tableParaPedidos = document.querySelector('#tableParaPedidos');
const allCheckBox = document.querySelectorAll('input[type=checkbox]:checked')
const printAllbtn = document.querySelector('#printAllbtn');

let ordersAll = [];
  let ordersSelectedToPrint = [];
  // let productosPedido = listadoDePedidos.productosNombre;
  // let cliente = listadoDePedidos.cliente
  // let fechaactual = Date.now().toLocaleString();


  
  

window.addEventListener('load', traerPedidos);

  async function traerPedidos(){
  
  const res = await axios.get('/pedidos/todos-axios');
  const ordersAll = res.data;
  console.log(ordersAll)
  //   for(let pedido of ordersAll){
  //   console.log(pedido.cliente)
  //   console.log(pedido.productosPedidosNombre)
  //   console.log(pedido + 'creado')
  // }
  showOrders(ordersAll);
  // var pdfObject = jsPDFInvoiceTemplate.default(props); 
  // console.log(pdfObject + 'creado')



}

printAllbtn.addEventListener('click',function(){
    
  try {
    //example: create a PDF using the template

//add new page or new content -> see jsPDF documentation

//...

    
if(ordersSelectedToPrint.length > 1){
  console.log(ordersSelectedToPrint);
  for (let orderPrint of ordersSelectedToPrint) {
    let pdfObject = jsPDFInvoiceTemplate.default(props); 

    // var pdfObject = jsPDFInvoiceTemplate.default({ ...props });
    console.log( 'object created' + pdfObject + orderPrint)
    // pdfObject.jsPDFDocObject.save();
    var props = {
      outputType: jsPDFInvoiceTemplate.OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: "remito",
      orientationLandscape: false,
      compress: true,
      
      
      business: {
        name: "Isidorito",
        address: "San Pedro, Buenos",
        phone: "(3329) 069 11 11 111",
        email: "contacto@isidorito.com",
        
        website: "www.isidorito.com.ar/nosotros",
      },
      contact: {
        label: "Remito dirigito a:",
        name: `${orderPrint.cliente.dueño}`,
        address:`${orderPrint.cliente.direccion}`,
        phone: `${orderPrint.cliente.telefono1}`,
        email: `${orderPrint.cliente.correo}`,
        
      },
      invoice: {
        label: "Pedido #",
        num: 19,
        invDate: `${orderPrint.createdAt}`,
        invGenDate: `28/10/2022`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          {
            title: "#", 
            style: { 
              width: 10 
            } 
          }, 
          { 
            title: "Productos descripción",
            style: {
              width: 70
            } 
          }, 
          { 
            title: "Cantidad ",
            style: {
              width:20
            } 
          }, 
          { title: "Por Unidad",
        style:{width:30}},
          // { title: "Cantidad"},
          { title: "Por tot",
        style:{
          width:30
        }},
          { title: "Total",
          style:{
            width:30
          }}
        ],
        table: Array.from(orderPrint.productosPedidosNombre).forEach(function(productoIm, index){[
            index + 1,
            `${productoIm.nombre} - ${productoIm.marca} - ${productoIm.presentacion}`,
            `${productoIm.cantidad}`,
            `${productoIm.cantidad}`,
            `${productoIm.cantidad}`,
            `${productoIm.cantidad}`,
        ]}),
      
        invDescLabel: "Cliente:",
        invDesc: `${orderPrint.cliente.nombreLocal}`,
      },
      footer: {
        text: "Este remito generado digitalmente es valido para el pedido realizado",
      },
      pageEnable: true,
      pageLabel: "Page ",
      };
  }
}
  } catch (error) {
    console.log(error);
  }

});

const showOrders =  (ordersAll) =>{
  for( let orderRow of ordersAll ){


    let rowPedidoRow = document.createElement('tr')
    let tdClienteNombreLocal = document.createElement('td');
    let ulProductos = document.createElement('td');
    let tdPedidoCantidadProductos = document.createElement('td');
    let tdPrecioTotalPedido = document.createElement('td');
    let checkboxImprimir = document.createElement('input')
    let eliminarPedido = document.createElement('div');
    checkboxImprimir.setAttribute("type", "checkbox");
    checkboxImprimir.classList.add("check");
    tdClienteNombreLocal.innerHTML = `${orderRow.cliente.nombreLocal} . ${orderRow.cliente.dueño}`;

    orderRow.productosPedidosNombre.forEach(producto=>{
      ulProductos.innerHTML= `
      <li class="">
          ${producto.nombre} - ${producto.marca}
      </li>
    `;
    });

    tdPedidoCantidadProductos.innerHTML = orderRow.cantidadDeProductos;
    tdPrecioTotalPedido.innerHTML = orderRow.importeTotal;
    tableParaPedidos.append(rowPedidoRow);
    eliminarPedido.innerHTML=`<form action="/pedidos/${orderRow._id}?_method=DELETE" method="post">
    <button class="btn btn-warning">Borrar</button>
</form>`;
    rowPedidoRow.append(tdClienteNombreLocal,ulProductos,tdPedidoCantidadProductos,tdPrecioTotalPedido,checkboxImprimir)
    
    checkboxImprimir.addEventListener('change', () => {
      console.log(checkboxImprimir.checked);
  if(checkboxImprimir.checked == true) {
    ordersSelectedToPrint.push(orderRow)
    console.log(ordersSelectedToPrint);
    }
    if(checkboxImprimir.checked == false){
        
							for (let i = 0; i < ordersSelectedToPrint.length; i++) {
								if (ordersSelectedToPrint[i].id == orderRow.id) {
									ordersSelectedToPrint.splice(i, 1);
								}
							}
              console.log('checkboxImprimir desclicleada')
              console.log(ordersSelectedToPrint);
              console.log(checkboxImprimir.checked);


    }
    console.log(checkboxImprimir.checked.length)
      //  Array.from(ordersSelectedToPrint[i], (productoIm, index)=>([
      //     index + 1,
      //     `${productoIm.cliente.nombreLocal}`,
      //     `${productoIm.cantidadDeProductos }`,
      //     `${productoIm.importeTotal }`,

      // ])),

      
      
    });
  };
};

    // Window.onload = async () => {
    //     let listadoDePedidos ;
    //     const res = await axios.get('/pedidos/todos-axios');.
    //     listadoDePedidos = res.data;
    //     printAllbtn.addEventListener('click', generatePDF())

    //     async function generatePDF(){
            


    //         var pdfObject = jsPDFInvoiceTemplate.default(props); 
    //         console.log(pdfObject + 'creado')
            
    //    }


    // }


// printAllbtn.addEventListener('click',generatePDF, function(){
//     // var doc = new jsPDF();
//     // console.log(allCheckBox)
//     // // doc.line(10,10,200,200)
//     // var pdfObject = jsPDFInvoiceTemplate.default(props);
    
//     // var margin = 10;
//     // var scale = (doc.internal.pageSize.width - margin *2 )/document.body.scrollWidth;

//     // pedidosSeleccionados.forEach(pedidoImp =>{
//     console.log()

//     //     //or in browser

      
//     //     // doc.addPage("a4")
//     //     // doc.text('primera',10,10)

//     //     // doc.text(`${pedidoImp.cantidad}`,10,20)
    
//     //     // for(let productosElegidos of pedidoImp.productosNombre){
//     //     //     doc.text(`${productosElegidos.nombreProducto}`,10,30)
    
//     //     // }
//     // })
//     // if(pedidos.lenght > 1 ){
//     // }
//     // doc.save(`impresionDeLosPedidos${fechaactual}.pdf`)
    
// })

