// const searchInput = document.getElementById('inputSearch');
// const searchResults = document.getElementById('divResultados');

const API_URL = '/administrador/buscar/productosb';

// searchInput.addEventListener('input', (event) => {
//   const searchText = event.target.value.trim().toLowerCase();
//   if (searchText.length > 0) {
//     axios.get(`${API_URL}?q=${searchText}`)
//       .then(response => {
//         searchResults.innerHTML = '';
//         response.data.forEach(product => {
//           const card = `
//             <div class="col-md-4">
//               <div class="card mb-4 shadow-sm">
//                 <div class="card-body">
//                   <h5 class="card-title">${product.nombre}</h5>
//                   <h6 class="card-subtitle mb-2 text-muted">Precio Venta: ${product.precioMayorista}</h6>
//                   <h6 class="card-subtitle mb-2 text-muted">Precio Costo: ${product.precioMinorista}</h6>
//                   <h6 class="card-subtitle mb-2 text-muted">Cantidad: ${product.cantidad}</h6>
//                 </div>
//               </div>
//             </div>
//           `;
//           searchResults.innerHTML += card;

//           card.addEventListener('click', () => {
//             console.log(product.nombre) 
//             console.log(product.cantidad)

//           });
//         });
//       })
//       .catch(error => console.error(error));
//   } else {
//     searchResults.innerHTML = '';
//   }
// });



// const searchInput = document.getElementById('search-input');
// const resultsContainer = document.getElementById('results-container');

// searchInput.addEventListener('input', async () => {
//   const query = searchInput.value;
//   if (query.length >= 3) { // Only make the AJAX request if the query is at least 3 characters long
//     const response = await axios.get(API_URL, { params: { q: query } });
//     const results = response.data;
//     // Display the matching results in the results container
//     resultsContainer.innerHTML = results.map(result => `
//       <div class="card">
//         <div class="card-body">
//           <h5 class="card-title">${result.name}</h5>
//           <a href="#" class="card-link" data-product-id="${result._id}">Select product</a>
//         </div>
//       </div>
//     `).join('');
//   } else {
//     resultsContainer.innerHTML = ''; // Clear the results container if the query is too short
//   }
// });

// resultsContainer.addEventListener('click', (event) => {
//   const link = event.target.closest('.card-link');
//   if (link) {
//     event.preventDefault();
//     const productId = link.dataset.productId;
//     const product = results.find(result => result._id === productId);
//     if (product) {
//       // Display the selected product below the search bar
//       const selectedProductContainer = document.getElementById('selected-product-container');
//       selectedProductContainer.innerHTML = `
//         <div class="card">
//           <div class="card-body">
//             <h5 class="card-title">${product.name}</h5>
//             <a href="${product.link}" class="card-link">Go to product page</a>
//           </div>
//         </div>
//       `;
//     }
//   }
// });
let searchInput = document.querySelector('#searchInput');
let searchResults = document.querySelector('#searchResults');

searchInput.addEventListener('input', () => {
  let searchQuery = searchInput.value;
  axios.get(`/administrador/buscar/productosb?q=${searchQuery}`)
    .then(response => {
      let products = response.data;
      let html = '';
      for (let product of products) {
        html += `<a href="#" class="list-group-item">${product.nombre}</a>`;
      }
      searchResults.innerHTML = html;
    })
    .catch(error => console.log(error));
});

searchResults.addEventListener('click', (event) => {
  event.preventDefault();
  let selectedProduct = event.target.textContent;
  let productCard = document.querySelector('#productCard');
  productCard.innerHTML = `<div class="card">
                              <div class="card-body">
                              <div class="card-body">
                              <h5 class="card-title">${product.nombre}</h5>
                              <h6 class="card-subtitle mb-2 text-muted">Precio Venta: ${product.precioMayorista}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Precio Costo: ${product.precioMinorista}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Cantidad: ${product.cantidad}</h6>
                            </div>
                            </div>`;
});
    <div class="card-body">
      <h5 class="card-title">${product.nombre}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Precio Venta: ${product.precioMayorista}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Precio Costo: ${product.precioMinorista}</h6>
      <h6 class="card-subtitle mb-2 text-muted">Cantidad: ${product.cantidad}</h6>
    </div>