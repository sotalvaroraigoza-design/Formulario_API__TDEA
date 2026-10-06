
// URL base de la API (backend Node + Express + MySQL: carpeta mi-servidor)
const API_URL = "http://localhost:3000/usuarios";

let formulario = document.getElementById("formulario");

// campos del formulario
let campos = formulario.querySelectorAll("input, select");
let campoTipoDocumento = document.getElementById("tipoDocumento");
let campoNumeroDocumento = document.getElementById("numeroDocumento");
let campoNombres = document.getElementById("nombres");
let campoApellidos = document.getElementById("apellidos");
let campoDireccion = document.getElementById("direccion");
let campoCiudad = document.getElementById("ciudad");
let campoFechaNacimiento = document.getElementById("fechaNacimiento");
let campoCorreo = document.getElementById("correo");

// cambio de color
campos.forEach(campo => {
    campo.addEventListener("focus", function() {
        this.style.backgroundColor = "#80F527";
    });

    campo.addEventListener("blur", function() {
        this.style.backgroundColor = "white";
    });
});

let botonGuardar = document.getElementById("btnGuardar");
let botonActualizar = document.getElementById("btnActualizar");
let botonEliminar = document.getElementById("btnEliminar");
let avisoDuplicado = document.getElementById("avisoDuplicado");
let tabla = document.getElementById("tablaPersonas");

// "personas" es la cache local: se llena desde la API al iniciar
// y se vuelve a sincronizar cada vez que se guarda/actualiza/elimina.
let personas = [];
let indiceActual = -1; // indice del registro encontrado en la cache local

function buscarPersona(tipoDocumento, numeroDocumento) {
    return personas.findIndex(p =>
        p.tipoDocumento === tipoDocumento && p.numeroDocumento === numeroDocumento
    );
}

// rellena el formulario con los datos de un registro existente
function cargarPersonaEnFormulario(persona) {
    campoNombres.value = persona.nombres;
    campoApellidos.value = persona.apellidos;
    campoDireccion.value = persona.direccion;
    campoCiudad.value = persona.ciudad;
    campoFechaNacimiento.value = persona.fechaNacimiento;
    campoCorreo.value = persona.correo;
}

// Trae todos los registros desde la API y refresca la tabla (cache + interfaz)
async function cargarPersonas() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("No se pudo consultar la API");
        personas = await respuesta.json();
        mostrarPersonas();
    } catch (error) {
        console.error("Error cargando personas:", error);
        alert("No se pudo conectar con la API. Verifica que mi-servidor este corriendo en http://localhost:3000");
    }
}

// Revisa que TODOS los campos obligatorios esten diligenciados/seleccionados
function camposCompletos() {
    return (
        campoTipoDocumento.value !== "" &&
        campoNumeroDocumento.value.trim() !== "" &&
        campoNombres.value.trim() !== "" &&
        campoApellidos.value.trim() !== "" &&
        campoDireccion.value.trim() !== "" &&
        campoCiudad.value !== "" &&
        campoFechaNacimiento.value !== "" &&
        campoCorreo.value.trim() !== ""
    );
}

// Habilita/deshabilita los 3 botones segun el estado actual del formulario.
// - Si falta tipo/numero de documento: todo deshabilitado.
// - Si el documento ya existe: Actualizar y Eliminar habilitados, Guardar no.
// - Si el documento es nuevo: Guardar se habilita solo cuando TODOS los
//   campos obligatorios estan diligenciados; Actualizar/Eliminar deshabilitados.
function actualizarBotones() {
    let tipoDocumento = campoTipoDocumento.value;
    let numeroDocumento = campoNumeroDocumento.value.trim();

    if (tipoDocumento === "" || numeroDocumento === "") {
        indiceActual = -1;
        avisoDuplicado.style.display = "none";
        botonGuardar.disabled = true;
        botonActualizar.disabled = true;
        botonEliminar.disabled = true;
        return;
    }

    indiceActual = buscarPersona(tipoDocumento, numeroDocumento);

    if (indiceActual !== -1) {
        avisoDuplicado.style.display = "block";
        botonGuardar.disabled = true;
        botonActualizar.disabled = false;
        botonEliminar.disabled = false;
    } else {
        avisoDuplicado.style.display = "none";
        botonActualizar.disabled = true;
        botonEliminar.disabled = true;
        botonGuardar.disabled = !camposCompletos();
    }
}

// Se dispara solo cuando cambia el tipo o el numero de documento:
// busca si ya existe y, de ser asi, carga sus datos en el formulario
// para poder editarlos (sin pisar lo que el usuario ya escribio en otros campos).
function validarExistencia() {
    let tipoDocumento = campoTipoDocumento.value;
    let numeroDocumento = campoNumeroDocumento.value.trim();

    if (tipoDocumento !== "" && numeroDocumento !== "") {
        let idx = buscarPersona(tipoDocumento, numeroDocumento);
        if (idx !== -1) {
            cargarPersonaEnFormulario(personas[idx]);
        }
    }

    actualizarBotones();
}

campoTipoDocumento.addEventListener("change", validarExistencia);
campoNumeroDocumento.addEventListener("input", validarExistencia);
campoNumeroDocumento.addEventListener("blur", validarExistencia);

// El resto de campos solo reevalua si ya esta todo diligenciado
// (no vuelve a cargar datos, para no pisar lo que el usuario esta escribiendo)
[campoNombres, campoApellidos, campoDireccion, campoFechaNacimiento, campoCorreo].forEach(campo => {
    campo.addEventListener("input", actualizarBotones);
});
campoCiudad.addEventListener("change", actualizarBotones);

// arma un objeto persona a partir del formulario
function construirPersonaDesdeFormulario() {
    let tipoDocumento = campoTipoDocumento.value;
    let numeroDocumento = campoNumeroDocumento.value.trim();

    return {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
        nombres: campoNombres.value,
        apellidos: campoApellidos.value,
        direccion: campoDireccion.value,
        ciudad: campoCiudad.value,
        fechaNacimiento: campoFechaNacimiento.value,
        correo: campoCorreo.value
    };
}

// refresh del formulario
function limpiarFormulario() {
    formulario.reset();
    actualizarBotones(); // con el formulario vacio, deja todo deshabilitado
}

// GUARDAR -> POST a la API (crea un registro nuevo)
botonGuardar.addEventListener("click", async function() {
    actualizarBotones();
    if (indiceActual !== -1 || !camposCompletos()) {
        return;
    }

    let persona = construirPersonaDesdeFormulario();

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona)
        });

        if (!respuesta.ok) throw new Error((await respuesta.json()).mensaje || "No se pudo guardar el registro");

        // sincroniza cache (personas) y refresca la tabla en pantalla
        await cargarPersonas();
        limpiarFormulario();
    } catch (error) {
        console.error(error);
        alert("Error al guardar: " + error.message);
    }
});

// ACTUALIZAR -> PUT a la API (sobreescribe el registro existente, no crea uno nuevo)
botonActualizar.addEventListener("click", async function() {
    if (indiceActual === -1) {
        return;
    }

    let persona = construirPersonaDesdeFormulario();
    let id = personas[indiceActual].id;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona)
        });

        if (!respuesta.ok) throw new Error((await respuesta.json()).mensaje || "No se pudo actualizar el registro");

        // sobreescribe en cache y refresca la tabla con los datos actualizados
        await cargarPersonas();
        limpiarFormulario();
    } catch (error) {
        console.error(error);
        alert("Error al actualizar: " + error.message);
    }
});

// ELIMINAR -> DELETE a la API
botonEliminar.addEventListener("click", async function() {
    if (indiceActual === -1) {
        return;
    }

    let id = personas[indiceActual].id;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) throw new Error("No se pudo eliminar el registro");

        // quita el registro de la cache y de la tabla en pantalla
        await cargarPersonas();
        limpiarFormulario();
    } catch (error) {
        console.error(error);
        alert("Ocurrio un error al eliminar en la API.");
    }
});

// devuelve el texto visible de una opcion de un <select> a partir de su value
function textoDeOpcion(select, valor) {
    const opcion = Array.from(select.options).find(o => o.value === valor);
    return opcion ? opcion.text : valor;
}

function mostrarPersonas() {

    // Limpiar la tabla
    tabla.innerHTML = "";

    personas.forEach(persona => {

        let fila = tabla.insertRow();
        fila.insertCell().textContent = textoDeOpcion(campoTipoDocumento, persona.tipoDocumento);
        fila.insertCell().textContent = persona.numeroDocumento;
        fila.insertCell().textContent = persona.nombres;
        fila.insertCell().textContent = persona.apellidos;
        fila.insertCell().textContent = persona.direccion;
        fila.insertCell().textContent = textoDeOpcion(campoCiudad, persona.ciudad);
        fila.insertCell().textContent = persona.fechaNacimiento;
        fila.insertCell().textContent = persona.correo;

    });
}

// Al cargar la pagina: trae lo que ya exista en la base de datos (via API)
// y deja los botones en su estado inicial (todo deshabilitado)
document.addEventListener("DOMContentLoaded", async function() {
    await cargarPersonas();
    actualizarBotones();
});
