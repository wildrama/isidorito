//Se oculta el subnav
const subnav = document.getElementsByClassName("subnav");
const body = document.getElementsByTagName("body");
const form = document.getElementById("formEdit")
const codigo = document.getElementById("codigoProducto")
const nombre = document.getElementById("nombreProducto")
const cantidad = document.getElementById("cantidadProducto");
const marca = document.getElementById("marcaProducto")
const precioMinorista = document.getElementById("precioMinorista")
const precioMayorista = document.getElementById("precioMayorista")
const precioCosto = document.getElementById("precioCosto")
const categoriaInterna = document.getElementById("categoriaInterna")
const mostrar = document.getElementById("mostrar")
const id = document.getElementById("id")
const peso = document.getElementById("peso")
const fechaDeVencimiento = document.getElementById("fechaDeVencimiento")
const impuesto = document.getElementById("impuesto")
let disabled = true;
const editGuar = document.getElementById("editGuar")



// default no obligatorias
if (fechaDeVencimiento.value == "") {
 fechaDeVencimiento.value = " "
}

if (peso.value == "") {
	peso.value = " "
}




body[0].style.backgroundColor = "#fff"
subnav[0].style.display = "none"
console.log(id.textContent)



//alert 

const alertar = (mensaje, color, producto) => {
	const pop = document.createElement("div")
	pop.innerHTML = mensaje + ' "' + producto + '"'
	pop.classList.add("alert")
	pop.classList.add(color)
	pop.style.position = "fixed"
	pop.style.top = "0";
	
	pop.style.width = "100%"
	body[0].appendChild(pop)
	setTimeout(() => {
		body[0].removeChild(pop)	
	}, 3000)
}



form.addEventListener("submit", async e => {

	e.preventDefault()
	if (disabled == true) {
		codigo.disabled = false;
		nombre.disabled = false;
		cantidad.disabled = false;
		marca.disabled = false;
		categoriaInterna.disabled = false;
		peso.disabled = false;
		fechaDeVencimiento.disabled = false;
		impuesto.disabled = false
		disabled = false;
		editGuar.innerHTML = "Guardar cambios"
		return
	}
	try {
		codigo.disabled = true;
		nombre.disabled = true;
		cantidad.disabled = true;
		marca.disabled = true;
		categoriaInterna.disabled = true;
		fechaDeVencimiento.disabled = true;
		peso.disabled = true;
		impuesto.disabled = true
		disabled = true;
		editGuar.innerHTML = "Editar"
		const send =  await axios.put(`/administrador/productos/${id.textContent}`, {codigo: codigo.value, nombre: nombre.value, cantidad: cantidad.value, marca: marca.value, precioMinorista: precioMinorista.value, precioMayorista: precioMayorista.value, precioCosto: precioCosto.value, categoria: categoriaInterna.value, peso: peso.value, fechaDeVencimiento: fechaDeVencimiento.value, impuestoAplicado: impuesto.value})
		


		alertar("Se modificaron los valores en el producto", "alert-success", send.data.nombre)

	} catch (error) {
		alertar("Se producto un error:", "alert-danger", error)
		console.log(impuesto.value)
		console.log(error)
	}
})
