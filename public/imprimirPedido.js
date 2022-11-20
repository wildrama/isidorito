console.log('pedido impreso')



const allCheckBox = document.querySelectorAll('input[type=checkbox]:checked')
const printAllbtn = document.querySelector('#printAllbtn');


let pedidosSeleccionados =[{
    cantidad: 3,
    productosNombre:[
        {
            nombreProducto: "TE no FINO",
            precioMayorista: 22
        }]
},
{
    cantidad:6,
    productosNombre:[
        {
            nombreProducto: "TE FINO",
            precioMayorista: 34
        }
    ]
}
];
let fechaactual =Date.now().toLocaleString();
function generatePDF(){
    var pdfObject = jsPDFInvoiceTemplate.default(props); 
  }
printAllbtn.addEventListener('click',generatePDF, function(){
    // var doc = new jsPDF();
    // console.log(allCheckBox)
    // // doc.line(10,10,200,200)
    // var pdfObject = jsPDFInvoiceTemplate.default(props);
    
    // var margin = 10;
    // var scale = (doc.internal.pageSize.width - margin *2 )/document.body.scrollWidth;

    // pedidosSeleccionados.forEach(pedidoImp =>{
    console.log()

    //     //or in browser

      
    //     // doc.addPage("a4")
    //     // doc.text('primera',10,10)

    //     // doc.text(`${pedidoImp.cantidad}`,10,20)
    
    //     // for(let productosElegidos of pedidoImp.productosNombre){
    //     //     doc.text(`${productosElegidos.nombreProducto}`,10,30)
    
    //     // }
    // })
    // if(pedidos.lenght > 1 ){
    // }
    // doc.save(`impresionDeLosPedidos${fechaactual}.pdf`)
    
})

  var props = {
outputType: jsPDFInvoiceTemplate.OutputType.Save,
returnJsPDFDocObject: true,
fileName: "Invoice 2021",
orientationLandscape: false,
compress: true,
logo: {
    src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
    type: 'PNG', //optional, when src= data:uri (nodejs case)
    width: 53.33, //aspect ratio = width/height
    height: 26.66,
    margin: {
        top: 0, //negative or positive num, from the current position
        left: 0 //negative or positive num, from the current position
    }
},
stamp: {
    inAllPages: true, //by default = false, just in the last page
    src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
    type: 'JPG', //optional, when src= data:uri (nodejs case)
    width: 20, //aspect ratio = width/height
    height: 20,
    margin: {
        top: 0, //negative or positive num, from the current position
        left: 0 //negative or positive num, from the current position
    }
},
business: {
    name: "Isidorito",
    address: "San Pedro, Buenos Aires",
    phone: "3329",
    email: "isidorito@example.com",
    email_1: "info@example.al",
    website: "www.example.al",
},
contact: {
    label: "Invoice issued for:",
    name: "Client Name",
    address: "Albania, Tirane, Astir",
    phone: "(+355) 069 22 22 222",
    email: "client@website.al",
    otherInfo: "www.website.al",
},
invoice: {
    label: "Invoice #: ",
    num: 19,
    invDate: "Payment Date: 01/01/2021 18:12",
    invGenDate: "Invoice Date: 02/02/2021 10:17",
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
        title: "Title",
        style: {
          width: 30
        } 
      }, 
      { 
        title: "Description",
        style: {
          width: 80
        } 
      }, 
      { title: "Price"},
      { title: "Quantity"},
      { title: "Unit"},
      { title: "Total"}
    ],
    table: Array.from(Array(10), (item, index)=>([
      
    ])),
    additionalRows: [{
        col1: 'Total:',
        col2: '145,250.50',
        col3: 'ALL',
        style: {
            fontSize: 14 //optional, default 12
        }
    },
    {
        col1: 'VAT:',
        col2: '20',
        col3: '%',
        style: {
            fontSize: 10 //optional, default 12
        }
    },
    {
        col1: 'SubTotal:',
        col2: '116,199.90',
        col3: 'ALL',
        style: {
            fontSize: 10 //optional, default 12
        }
    }],
    invDescLabel: "Invoice Note",
    invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
},
footer: {
    text: "The invoice is created on a computer and is valid without the signature and stamp.",
},
pageEnable: true,
pageLabel: "Page ",
};