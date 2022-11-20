console.log('pedido impreso')



const allCheckBox = document.querySelectorAll('input[type=checkbox]:checked')
const printAllbtn = document.querySelector('#printAllbtn');



let fechaactual =Date.now().toLocaleString();

   
    Window.onload = async () => {
        let listadoDePedidos ;
        const res = await axios.get('/pedidos/todos-axios');.
        listadoDePedidos = res.data;
        printAllbtn.addEventListener('click', generatePDF())

        async function generatePDF(){
            


            var pdfObject = jsPDFInvoiceTemplate.default(props); 
            console.log(pdfObject + 'creado')
            
       }

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
            
            website: "www.ididorito.com.ar/nosotros",
        },
        contact: {
            label: "Remito dirigito a:",
            name: `${cliente.nombreLocal}`,
            address:`${cliente.direccion}`,
            phone: `${cliente.telefono1}`,
            email: `${cliente.correo}`,
            
        },
        invoice: {
            label: "Pedido #",
            num: 19,
            invDate: `${pedido.createdAt}`,
            invGenDate: `${fechaRegistroPedido}`,
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
                title: "Productos",
                style: {
                  width: 80
                } 
              }, 
              { 
                title: "Descripción",
                style: {
                  width: 30
                } 
              }, 
              { title: "Precio"},
              // { title: "Cantidad"},
              // { title: "Unidad"},
              // { title: "Total"}
            ],
            table: Array.from(productosNombre, (productoIm, index)=>([
                index + 1,
                `${productoIm.cliente.nombreLocal}`,
                `${productoIm.cantidadDeProductos }`,
                `${productoIm.importeTotal }`,
     
            ])),
     
            invDescLabel: "Cliente:",
            invDesc: "ZOESITA",
        },
        footer: {
            text: "The invoice is created on a computer and is valid without the signature and stamp.",
        },
        pageEnable: true,
        pageLabel: "Page ",
     };
    }


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

