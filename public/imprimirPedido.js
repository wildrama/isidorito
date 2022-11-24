console.log('pedido impreso')


const tableParaPedidos = document.querySelector('#tableParaPedidos');
const allCheckBox = document.querySelectorAll('input[type=checkbox]:checked')
const printAllbtn = document.querySelector('#printAllbtn');

let pedidosTodos = [];
  let pedidosSeleccionadosParaImprimir = [];
  // let productosPedido = listadoDePedidos.productosNombre;
  // let cliente = listadoDePedidos.cliente
  let fechaactual = Date.now().toLocaleString();

  printAllbtn.addEventListener('click',traerPedidos)

  async function traerPedidos(){
  
  const res = await axios.get('/pedidos/todos-axios');
  const pedidosTodos = res.data;
  console.log(pedidosTodos)
  //   for(let pedido of pedidosTodos){
  //   console.log(pedido.cliente)
  //   console.log(pedido.productosPedidosNombre)
  //   console.log(pedido + 'creado')
  // }
  mostrarProductosAgregados(pedidosTodos);
  // var pdfObject = jsPDFInvoiceTemplate.default(props); 
  // console.log(pdfObject + 'creado')

// var props = {
// outputType: jsPDFInvoiceTemplate.OutputType.Save,
// returnJsPDFDocObject: true,
// fileName: "remito",
// orientationLandscape: false,
// compress: true,


// business: {
//   name: "Isidorito",
//   address: "San Pedro, Buenos",
//   phone: "(3329) 069 11 11 111",
//   email: "contacto@isidorito.com",
  
//   website: "www.isidorito.com.ar/nosotros",
// },
// contact: {
//   label: "Remito dirigito a:",
//   name: `${cliente.dueño}`,
//   address:`${cliente.dueño}`,
//   phone: `${cliente.telefono1}`,
//   email: `${cliente.correo}`,
  
// },
// invoice: {
//   label: "Pedido #",
//   num: 19,
//   invDate: `${pedido}`,
//   invGenDate: `28/10/2022`,
//   headerBorder: false,
//   tableBodyBorder: false,
//   header: [
//     {
//       title: "#", 
//       style: { 
//         width: 10 
//       } 
//     }, 
//     { 
//       title: "Productos descripción",
//       style: {
//         width: 70
//       } 
//     }, 
//     { 
//       title: "Cantidad ",
//       style: {
//         width:20
//       } 
//     }, 
//     { title: "Por Unidad",
//   style:{width:30}},
//     // { title: "Cantidad"},
//     { title: "Por tot",
//   style:{
//     width:30
//   }},
//     { title: "Total",
//     style:{
//       width:30
//     }}
//   ],
//   table: Array.from(productosPedido).forEach(function(productoIm, index){[
//       index + 1,
//       `${productoIm.nombre} - ${productoIm.marca} - ${productoIm.presentacion}`,
//       `${productoIm.cantidad}`,
//       `${productoIm.cantidad}`,
//       `${productoIm.cantidad}`,
//       `${productoIm.cantidad}`,
//   ]}),

//   invDescLabel: "Cliente:",
//   invDesc: `${cliente.nombreLocal}`,
// },
// footer: {
//   text: "Este remito generado digitalmente es valido para el pedido realizado",
// },
// pageEnable: true,
// pageLabel: "Page ",
// };

}

const mostrarProductosAgregados =  (pedidosTodos) =>{
  for( let pedidoRow of pedidosTodos ){


    let rowPedidoRow = document.createElement('tr')
    let tdClienteNombreLocal = document.createElement('td');
    let ulProductos = document.createElement('td');
    let tdPedidoCantidadProductos = document.createElement('td');
    let tdPrecioTotalPedido = document.createElement('td');
    let checkboxImprimir = document.createElement('input')
    let eliminarPedido = document.createElement('div');
    checkboxImprimir.setAttribute("type", "checkbox");
    checkboxImprimir.classList.add("check");
    // tdClienteNombreLocal.innerHTML = `${pedidoRow.cliente.nombreLocal} . ${pedidoRow.cliente.dueño}`;

    pedidoRow.productosPedidosNombre.forEach(producto=>{
      ulProductos.innerHTML= `
      <li class="">
          ${producto.nombre} - ${producto.marca}
      </li>
    `;
    });

    tdPedidoCantidadProductos.innerHTML = pedidoRow.cantidadDeProductos;
    tdPrecioTotalPedido.innerHTML = pedidoRow.importeTotal;
    tableParaPedidos.append(rowPedidoRow);
    eliminarPedido.innerHTML=`<form action="/pedidos/${pedidoRow._id}?_method=DELETE" method="post">
    <button class="btn btn-warning">Borrar</button>
</form>`;
    rowPedidoRow.append(tdClienteNombreLocal,ulProductos,tdPedidoCantidadProductos,tdPrecioTotalPedido,eliminarPedido,checkboxImprimir)
    
    checkboxImprimir.addEventListener('change', () => {
      console.log(checkboxImprimir.checked);
  if(checkboxImprimir.checked == true) {
    pedidosSeleccionadosParaImprimir.push(pedidoRow)
    console.log(pedidosSeleccionadosParaImprimir);
    }
    if(checkboxImprimir.checked == false){
        
							for (let i = 0; i < pedidosSeleccionadosParaImprimir.length; i++) {
								if (pedidosSeleccionadosParaImprimir[i].id == pedidoRow.id) {
									pedidosSeleccionadosParaImprimir.splice(i, 1);
								}
							}
              console.log('checkboxImprimir desclicleada')
              console.log(pedidosSeleccionadosParaImprimir);
              console.log(checkboxImprimir.checked);


    }
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

