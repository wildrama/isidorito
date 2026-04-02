const cajaData = window.CAJA_DATA || {};
const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2
});

const state = {
  items: [],
  lastFinderResults: []
};

const elements = {
  barcodeForm: document.getElementById('barcodeForm'),
  barcodeInput: document.getElementById('barcodeInput'),
  cartTableBody: document.getElementById('cartTableBody'),
  subtotalAmount: document.getElementById('subtotalAmount'),
  discountAmount: document.getElementById('discountAmount'),
  totalAmount: document.getElementById('totalAmount'),
  changeAmount: document.getElementById('changeAmount'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  newSaleBtn: document.getElementById('newSaleBtn'),
  openFinderBtn: document.getElementById('openFinderBtn'),
  closeFinderBtn: document.getElementById('closeFinderBtn'),
  finderModal: document.getElementById('finderModal'),
  finderSearchForm: document.getElementById('finderSearchForm'),
  finderQuery: document.getElementById('finderQuery'),
  finderResults: document.getElementById('finderResults'),
  statusMessage: document.getElementById('statusMessage'),
  cashReceivedInput: document.getElementById('cashReceivedInput'),
  cashReceivedGroup: document.getElementById('cashReceivedGroup'),
  paymentInputs: Array.from(document.querySelectorAll('input[name="metodoPago"]')),
  offerButtons: Array.from(document.querySelectorAll('.offer-button')),
  ticketToggle: document.getElementById('ticketToggle')
};

const offerMap = new Map((cajaData.ofertasConjunto || []).map((offer) => [String(offer._id), offer]));
const individualOfferMap = new Map(
  (cajaData.ofertasIndividuales || [])
    .filter((offer) => offer.productoEnOferta && offer.productoEnOferta._id)
    .map((offer) => [String(offer.productoEnOferta._id), offer])
);

const formatMoney = (value) => currency.format(Number(value || 0));
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const toQuantity = (value) => Math.max(1, Math.floor(toNumber(value, 1)));

let statusTimer;
function showStatus(message, type = 'info') {
  if (!elements.statusMessage) return;

  elements.statusMessage.hidden = false;
  elements.statusMessage.className = `cash-status ${type}`;
  elements.statusMessage.textContent = message;

  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    elements.statusMessage.hidden = true;
  }, 3500);
}

function getMetodoPago() {
  const selected = elements.paymentInputs.find((input) => input.checked);
  return selected ? selected.value : 'EFECTIVO';
}

function syncPaymentLabels() {
  elements.paymentInputs.forEach((input) => {
    const label = input.closest('.payment-option');
    if (!label) return;
    label.classList.toggle('active-option', input.checked);
  });

  const isCash = getMetodoPago() === 'EFECTIVO';
  elements.cashReceivedGroup.hidden = !isCash;
  if (!isCash) {
    elements.cashReceivedInput.value = '';
  }

  updateChange();
}

function getLineCalculation(item) {
  const quantity = toQuantity(item.quantity);
  const regularSubtotal = Number((toNumber(item.unitPrice) * quantity).toFixed(2));

  if (item.kind === 'offer') {
    return {
      regularSubtotal,
      finalSubtotal: regularSubtotal,
      discount: 0,
      note: item.productsText || 'Oferta precargada'
    };
  }

  const offer = individualOfferMap.get(String(item.productId));
  if (!offer || quantity < toQuantity(offer.cantidadDeUnidadesNecesarias)) {
    return {
      regularSubtotal,
      finalSubtotal: regularSubtotal,
      discount: 0,
      note: item.stock > 0 ? `Stock: ${item.stock}` : 'Sin stock'
    };
  }

  const packSize = toQuantity(offer.cantidadDeUnidadesNecesarias);
  const packPrice = toNumber(offer.precioOferta);
  const packs = Math.floor(quantity / packSize);
  const remainder = quantity % packSize;
  const finalSubtotal = Number(((packs * packPrice) + (remainder * toNumber(item.unitPrice))).toFixed(2));

  return {
    regularSubtotal,
    finalSubtotal,
    discount: Number((regularSubtotal - finalSubtotal).toFixed(2)),
    note: `Oferta automática aplicada: ${packSize}u por ${formatMoney(packPrice)}`
  };
}

function calculateSummary() {
  return state.items.reduce((acc, item) => {
    const calc = getLineCalculation(item);
    acc.subtotal += calc.regularSubtotal;
    acc.total += calc.finalSubtotal;
    acc.discount += calc.discount;
    return acc;
  }, { subtotal: 0, total: 0, discount: 0 });
}

function updateChange() {
  const summary = calculateSummary();
  const isCash = getMetodoPago() === 'EFECTIVO';
  const efectivo = toNumber(elements.cashReceivedInput.value);
  const change = isCash ? Math.max(0, efectivo - summary.total) : 0;
  elements.changeAmount.textContent = formatMoney(change);
}

function renderCart() {
  if (!elements.cartTableBody) return;

  if (!state.items.length) {
    elements.cartTableBody.innerHTML = `
      <tr class="empty-state-row">
        <td colspan="5">No hay productos cargados todavía. Escaneá con el lector o usá la búsqueda manual.</td>
      </tr>
    `;
  } else {
    elements.cartTableBody.innerHTML = state.items.map((item) => {
      const calc = getLineCalculation(item);
      return `
        <tr>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">${item.code || ''} ${calc.note ? `· ${calc.note}` : ''}</div>
          </td>
          <td class="text-center">
            <div class="qty-controls">
              <button type="button" data-action="decrease" data-key="${item.key}">−</button>
              <span>${toQuantity(item.quantity)}</span>
              <button type="button" data-action="increase" data-key="${item.key}">+</button>
            </div>
          </td>
          <td class="text-end">${formatMoney(item.unitPrice)}</td>
          <td class="text-end">${formatMoney(calc.finalSubtotal)}</td>
          <td class="text-center">
            <button type="button" class="remove-line-btn" data-action="remove" data-key="${item.key}">Quitar</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  const summary = calculateSummary();
  elements.subtotalAmount.textContent = formatMoney(summary.subtotal);
  elements.discountAmount.textContent = `-${formatMoney(summary.discount)}`;
  elements.totalAmount.textContent = formatMoney(summary.total);
  updateChange();
}

function resetSale(message) {
  state.items = [];
  elements.cashReceivedInput.value = '';
  if (elements.ticketToggle) elements.ticketToggle.checked = true;
  renderCart();
  elements.barcodeInput.focus();
  if (message) showStatus(message, 'success');
}

function addProduct(producto, quantity = 1) {
  const stock = toNumber(producto.cantidad);
  if (stock <= 0) {
    showStatus(`Sin stock disponible para ${producto.nombre}.`, 'error');
    return;
  }

  const safeQuantity = Math.min(toQuantity(quantity), stock);
  const existing = state.items.find((item) => item.kind === 'product' && item.productId === String(producto._id));

  if (existing) {
    existing.quantity = Math.min(stock, toQuantity(existing.quantity) + safeQuantity);
  } else {
    state.items.push({
      key: `product-${producto._id}`,
      kind: 'product',
      productId: String(producto._id),
      code: `Cod. ${producto.codigo}`,
      name: producto.nombre,
      brand: producto.marca,
      unitPrice: toNumber(producto.precioMinorista),
      quantity: safeQuantity,
      stock
    });
  }

  renderCart();
  showStatus(`${producto.nombre} agregado a la compra.`, 'success');
}

function addOffer(offerId) {
  const offer = offerMap.get(String(offerId));
  if (!offer) return;

  const existing = state.items.find((item) => item.kind === 'offer' && item.offerId === String(offerId));
  if (existing) {
    existing.quantity = toQuantity(existing.quantity) + 1;
  } else {
    state.items.push({
      key: `offer-${offerId}`,
      kind: 'offer',
      offerId: String(offerId),
      code: 'OFERTA',
      name: offer.nombreOferta,
      unitPrice: toNumber(offer.precioOferta),
      quantity: 1,
      productsText: offer.productosTexto || 'Combo cargado'
    });
  }

  renderCart();
  showStatus(`Se agregó ${offer.nombreOferta}.`, 'success');
}

function changeQuantity(key, delta) {
  const item = state.items.find((entry) => entry.key === key);
  if (!item) return;

  const nextValue = toQuantity(item.quantity) + delta;
  if (nextValue <= 0) {
    state.items = state.items.filter((entry) => entry.key !== key);
    renderCart();
    return;
  }

  if (item.kind === 'product' && item.stock > 0) {
    item.quantity = Math.min(item.stock, nextValue);
    if (nextValue > item.stock) {
      showStatus(`Stock máximo disponible: ${item.stock}.`, 'info');
    }
  } else {
    item.quantity = nextValue;
  }

  renderCart();
}

function openFinder(results = [], query = '') {
  elements.finderModal.hidden = false;
  if (query) {
    elements.finderQuery.value = query;
  }
  if (results.length) {
    renderFinderResults(results);
  }
  window.setTimeout(() => elements.finderQuery.focus(), 40);
}

function closeFinder() {
  elements.finderModal.hidden = true;
  elements.barcodeInput.focus();
}

function renderFinderResults(results) {
  if (!results.length) {
    elements.finderResults.innerHTML = '<p class="finder-empty">No se encontraron productos.</p>';
    return;
  }

  elements.finderResults.innerHTML = results.map((producto) => `
    <article class="finder-result-card">
      <div>
        <h3>${producto.nombre}</h3>
        <p>Cod. ${producto.codigo} · ${producto.marca || 'Sin marca'}</p>
        <small>Stock: ${toNumber(producto.cantidad)} · Precio: ${formatMoney(producto.precioMinorista)}</small>
      </div>
      <button type="button" class="btn btn-sm btn-success" data-add-product="${producto._id}">Agregar</button>
    </article>
  `).join('');
}

async function searchProducts(query, { autoAdd = false, keepOpen = false } = {}) {
  const trimmed = String(query || '').trim();
  if (!trimmed) return [];

  const response = await fetch(`/caja/${cajaData.estacionId}/productos/buscar?q=${encodeURIComponent(trimmed)}`);
  const payload = await response.json();
  const results = Array.isArray(payload.data) ? payload.data : [];

  if (!response.ok) {
    throw new Error(payload.message || 'No se pudo realizar la búsqueda.');
  }

  state.lastFinderResults = results;

  if (!results.length) {
    if (!keepOpen) showStatus('No se encontró ningún producto con ese criterio.', 'error');
    renderFinderResults([]);
    return [];
  }

  const exactCodeMatch = results.find((producto) => String(producto.codigo) === trimmed);
  if (autoAdd && (exactCodeMatch || results.length === 1)) {
    addProduct(exactCodeMatch || results[0]);
    return results;
  }

  renderFinderResults(results);
  openFinder(results, trimmed);
  return results;
}

async function handleCheckout() {
  if (!state.items.length) {
    showStatus('Primero agregá productos a la compra.', 'error');
    return;
  }

  const summary = calculateSummary();
  const metodoPago = getMetodoPago();
  const efectivoRecibido = toNumber(elements.cashReceivedInput.value);

  if (metodoPago === 'EFECTIVO' && efectivoRecibido < summary.total) {
    showStatus('El efectivo recibido debe ser igual o mayor al total.', 'error');
    elements.cashReceivedInput.focus();
    return;
  }

  elements.checkoutBtn.disabled = true;
  elements.checkoutBtn.textContent = 'Registrando...';

  try {
    const response = await fetch(`/caja/${cajaData.estacionId}/registrar-venta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: state.items.map((item) => ({
          kind: item.kind,
          productId: item.productId,
          offerId: item.offerId,
          quantity: toQuantity(item.quantity),
          unitPrice: toNumber(item.unitPrice)
        })),
        metodoPago,
        efectivoRecibido,
        ticketEntregado: elements.ticketToggle && elements.ticketToggle.checked ? 'SI' : 'NO'
      })
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'No se pudo registrar la venta.');
    }

    resetSale(`Venta registrada por ${formatMoney(payload.total)}${payload.cambio ? ` · Vuelto: ${formatMoney(payload.cambio)}` : ''}`);
  } catch (error) {
    showStatus(error.message || 'Ocurrió un error al registrar la venta.', 'error');
  } finally {
    elements.checkoutBtn.disabled = false;
    elements.checkoutBtn.textContent = '✅ Registrar venta';
  }
}

elements.barcodeForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const value = elements.barcodeInput.value.trim();
  if (!value) return;

  try {
    await searchProducts(value, { autoAdd: true });
    elements.barcodeInput.value = '';
  } catch (error) {
    showStatus(error.message, 'error');
  }
});

elements.finderSearchForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await searchProducts(elements.finderQuery.value, { keepOpen: true });
  } catch (error) {
    showStatus(error.message, 'error');
  }
});

elements.finderResults?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add-product]');
  if (!button) return;

  const productId = button.getAttribute('data-add-product');
  const producto = state.lastFinderResults.find((item) => String(item._id) === String(productId));

  if (producto) {
    addProduct(producto);
    closeFinder();
  }
});

elements.cartTableBody?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, key } = button.dataset;

  if (action === 'remove') {
    state.items = state.items.filter((item) => item.key !== key);
    renderCart();
    return;
  }

  if (action === 'increase') {
    changeQuantity(key, 1);
  }

  if (action === 'decrease') {
    changeQuantity(key, -1);
  }
});

elements.paymentInputs.forEach((input) => {
  input.addEventListener('change', syncPaymentLabels);
});

elements.cashReceivedInput?.addEventListener('input', updateChange);
elements.checkoutBtn?.addEventListener('click', handleCheckout);
elements.newSaleBtn?.addEventListener('click', () => resetSale('Compra limpia para iniciar una nueva venta.'));
elements.openFinderBtn?.addEventListener('click', () => openFinder());
elements.closeFinderBtn?.addEventListener('click', closeFinder);
elements.offerButtons.forEach((button) => {
  button.addEventListener('click', () => addOffer(button.dataset.offerId));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'F4') {
    event.preventDefault();
    openFinder();
  }

  if (event.key === 'F9') {
    event.preventDefault();
    handleCheckout();
  }

  if (event.key === 'Escape' && !elements.finderModal.hidden) {
    closeFinder();
  }
});

renderCart();
syncPaymentLabels();
elements.barcodeInput?.focus();
