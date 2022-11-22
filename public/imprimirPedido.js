console.log('pedido impreso')



const allCheckBox = document.querySelectorAll('input[type=checkbox]:checked')
const printAllbtn = document.querySelector('#printAllbtn');
 let pedidosTodos = []

  // let productosPedido = listadoDePedidos.productosNombre;
  // let cliente = listadoDePedidos.cliente
  let fechaactual = Date.now().toLocaleString();

  printAllbtn.addEventListener('click',generatePDF)

  async function generatePDF(){
  
  const res = await axios.get('/pedidos/todos-axios');
  const pedidoPedidos = res.data;
  console.log(pedidoPedidos)
    for(let pedido of pedidoPedidos){
    console.log(pedido.cliente)
    console.log(pedido.productosPedidosNombre)
    console.log(pedido + 'creado')

  }

  // var pdfObject = jsPDFInvoiceTemplate.default(props); 
  // console.log(pdfObject + 'creado')

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
  name: `${cliente.dueño}`,
  address:`${cliente.dueño}`,
  phone: `${cliente.telefono1}`,
  email: `${cliente.correo}`,
  
},
invoice: {
  label: "Pedido #",
  num: 19,
  invDate: `${pedido}`,
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
  table: Array.from(productosPedido).forEach(function(productoIm, index){[
      index + 1,
      `${productoIm.nombre} - ${productoIm.marca} - ${productoIm.presentacion}`,
      `${productoIm.cantidad}`,
      `${productoIm.cantidad}`,
      `${productoIm.cantidad}`,
      `${productoIm.cantidad}`,
  ]}),

  invDescLabel: "Cliente:",
  invDesc: `${cliente.nombreLocal}`,
},
footer: {
  text: "Este remito generado digitalmente es valido para el pedido realizado",
},
pageEnable: true,
pageLabel: "Page ",
};

}

const mostrarProductosAgregados =  () =>{
  pedidosTodos.forEach( pedidoRow =>{


    let rowPedidoRow = document.createElement('tr')
    let tdClienteNombreLocal = document.createElement('td');
    let ulProductos = document.createElement('td');
    let tdPedidoCantidadProductos = document.createElement('td');
    let tdProductoRowPrecioProducto = document.createElement('td');


    tdClienteNombreLocal.innerHTML = `${pedidoRow.nombre}`

    pedidoRow.productosPedidosNombre.forEach(producto=>{
      ulProductos.innerHTML= `
    
      <li>

      </li>
    `;
    })

    tdPedidoCantidadProductos.innerHTML = pedidoRow.cantidad;
    tdPrecioTotalPedido.innerHTML = pedidoRow.precioMayorista;
    tableParaProductosP.append(rowPedidoRow);
    rowPedidoRow.append(tdClienteNombreLocal,ulProductos,tdPedidoCantidadProductos,tdPrecioTotalPedido)
    
      
  })
}

   
    // Window.onload = async () => {
    //     let listadoDePedidos ;
    //     const res = await axios.get('/pedidos/todos-axios');.
    //     listadoDePedidos = res.data;
    //     printAllbtn.addEventListener('click', generatePDF())

    //     async function generatePDF(){
            


    //         var pdfObject = jsPDFInvoiceTemplate.default(props); 
    //         console.log(pdfObject + 'creado')
            
    //    }

    //    var props = {
    //     outputType: jsPDFInvoiceTemplate.OutputType.Save,
    //     returnJsPDFDocObject: true,
    //     fileName: "remito",
    //     orientationLandscape: false,
    //     compress: true,
      
        
    //     business: {
    //         name: "Isidorito",
    //         address: "San Pedro, Buenos",
    //         phone: "(3329) 069 11 11 111",
    //         email: "contacto@isidorito.com",
            
    //         website: "www.ididorito.com.ar/nosotros",
    //     },
    //     contact: {
    //         label: "Remito dirigito a:",
    //         name: `${cliente.nombreLocal}`,
    //         address:`${cliente.direccion}`,
    //         phone: `${cliente.telefono1}`,
    //         email: `${cliente.correo}`,
            
    //     },
    //     invoice: {
    //         label: "Pedido #",
    //         num: 19,
    //         invDate: `${pedido.createdAt}`,
    //         invGenDate: `${fechaRegistroPedido}`,
    //         headerBorder: false,
    //         tableBodyBorder: false,
    //         header: [
    //           {
    //             title: "#", 
    //             style: { 
    //               width: 10 
    //             } 
    //           }, 
    //           { 
    //             title: "Productos",
    //             style: {
    //               width: 80
    //             } 
    //           }, 
    //           { 
    //             title: "Descripción",
    //             style: {
    //               width: 30
    //             } 
    //           }, 
    //           { title: "Precio"},
    //           // { title: "Cantidad"},
    //           // { title: "Unidad"},
    //           // { title: "Total"}
    //         ],
    //         table: Array.from(productosNombre, (productoIm, index)=>([
    //             index + 1,
    //             `${productoIm.cliente.nombreLocal}`,
    //             `${productoIm.cantidadDeProductos }`,
    //             `${productoIm.importeTotal }`,
     
    //         ])),
     
    //         invDescLabel: "Cliente:",
    //         invDesc: "ZOESITA",
    //     },
    //     footer: {
    //         text: "The invoice is created on a computer and is valid without the signature and stamp.",
    //     },
    //     pageEnable: true,
    //     pageLabel: "Page ",
    //  };
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

