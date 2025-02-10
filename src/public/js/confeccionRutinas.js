

document.addEventListener("DOMContentLoaded", function () {
  // Obtener el elemento que deseas llenar con el contenido guardado
  let muestraRutina = document.getElementById("muestra_rutina");

  // Verificar si hay contenido guardado en el local storage
  let contenidoGuardado = localStorage.getItem("contenido_rutina");

  // Si hay contenido guardado, establecerlo como el HTML de la sección
  if (contenidoGuardado) {
    muestraRutina.innerHTML = contenidoGuardado;
  }
});

//LLAMO LOS ELEMENTOS DEL DOM

const fecha = document.querySelector("#fecha");
const ingresoFecha = document.querySelector("#ingreso_fecha");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const cargaUno = document.querySelector("#carga_uno");
const dia = document.querySelector("#dia");
const grupo = document.querySelector("#grupo");
const buttonSumarDia = document.querySelector("#dia_grupo");
const agregarSubtitulo = document.querySelector("#agrega_subtitulo");
const circuito = document.querySelector("#circuito");
const muestraRutina = document.querySelector("#muestra_rutina");
const ingresoRutina = document.querySelector("#ingreso_rutina");
const ejercicios = document.querySelector("#ejercicios");
const divResultados = document.querySelector("#resultados");
const seriesRepeticiones = document.querySelector("#series_repeticiones");
const agregarEjercicio = document.querySelector("#agregar_ejercicio");
const observaciones = document.querySelector("#observaciones");
const profesor = document.querySelector("#nombreProfesor");

let fechaRutina;
//CLASE MOLDE PARA EJERCICIOS
class Ejercicio {
  constructor(id, nombre, musculo, video, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.musculo = musculo;
    this.video = video;
    this.imagen = imagen;
  }
}

class BaseDeDatos {
  constructor() {
    this.ejerciciosBD = [];

    this.cargarRegistros();
  }
  async cargarRegistros() {
    const resultado = await fetch(`/json/ejercicios.json`);
    this.ejerciciosBD = await resultado.json();
  }
  //FUNCION QUE BUSCA POR GRUPO MUSCULAR
  registrosPorMusculos(musculo) {
    return this.ejerciciosBD.filter((m) => m.musculo == musculo);
  }
  registrosPorNombre(palabra) {
    return this.ejerciciosBD.filter((ejercicio) =>
      ejercicio.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

const bd = new BaseDeDatos();
//HACER QUE SE VAYAN AGREGANDO DEBAJO TODOS LOS DATOS QUE VOY COMPLETANDO
const imagenPerfil = document.querySelector("#input-imagen");

cargaUno.addEventListener("click", () => {
  if (nombre.value === "" && apellido.value === "") {
    alert("No ha ingresado datos");
  } else {
    const fechaISO = fecha.value;
    const fechaLocal = new Date(fechaISO);
    fechaLocal.setDate(fechaLocal.getDate() + 1);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let fechaFormateada = fechaLocal.toLocaleDateString("es-AR", options);
    // const imagenURL = sessionStorage.getItem("imagenURL");

    fechaFormateada = fechaFormateada.replace(/^\w/, (c) => c.toUpperCase());
    fechaRutina = fechaFormateada;
    ingresoFecha.innerHTML += `<div class="datos_actuales"><div class="fecha_nombre"><p>Fecha: ${fechaFormateada} </p>
  <p class="nombre_apellido"><span class="apellido_span">${
    apellido.textContent
  }</span>${" "}<span class="nombre_span">${nombre.textContent}</span> </p>
  </div>
  
  </div>`;

    fecha.value = "";
  }
});
const diasIngresados = new Set();

buttonSumarDia.addEventListener("click", () => {
  const diaActual = dia.value;
  if (diaActual > 0) {
    if (diasIngresados.has(diaActual.toString())) {
      alert("Este N° de día ya ha sido ingresado");
      return;
    }

    ingresoRutina.innerHTML += `
    
      <div class="h2_dia">
        <h2> DIA ${diaActual} - </h2>
        <h2> ${grupo.value.toUpperCase()}</h2><a href="#" class="btnQuitarDia" data-id="${diaActual}">
        <img class="imagenX" src="/assets/images/close.svg" alt="icono de una x"/></a>
      </div>
      
    `;

    diasIngresados.add(diaActual.toString()); // Agregamos el día al conjunto de días ingresados

    const botonesQuitar = document.querySelectorAll(".btnQuitarDia");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idDia = boton.dataset.id.toString();
        const diaAEliminar = document.querySelector(`[data-id="${idDia}"]`);
        if (diaAEliminar) {
          ingresoRutina.removeChild(diaAEliminar.parentElement);
          diasIngresados.delete(idDia); // Eliminamos el día del conjunto de días ingresados
        }
      });
    }
  } else {
    alert("Número de día inválido");
  }
  dia.value = "";
  grupo.value = "";
});

agregarSubtitulo.addEventListener("click", () => {
  if (circuito.value === "") {
    alert("No ha ingresado datos");
  } else {
    ingresoRutina.innerHTML += `<div class="h3_circuito"><h3>${circuito.value.toUpperCase()}</h3><a href="#" class="btnQuitarDia" data-id="${
      circuito.value
    }"><img class="imagenX" src="/assets/images/close.svg" alt="icono de una x"/></a></div>`;
    const botonesQuitar = document.querySelectorAll(".btnQuitarDia");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idDia = String(boton.dataset.id);
        const diaAEliminar = document.querySelector(`[data-id="${idDia}"]`);
        if (diaAEliminar) {
          ingresoRutina.removeChild(diaAEliminar.parentElement);
        }
      });
    }
  }

  circuito.value = "";
});

ejercicios.addEventListener("input", function () {
  const textoBuscado = ejercicios.value.trim().toUpperCase();

  // Limpia el contenido anterior de resultados
  divResultados.innerHTML = "";

  if (textoBuscado === "") {
    return; // Si no hay texto, no se muestra la lista desplegable
  }

  // Filtro ejercicios que coincidan con el texto buscado
  const coincidencias = bd.ejerciciosBD.filter((ejercicio) =>
    ejercicio.nombre.toUpperCase().includes(textoBuscado)
  );

  // Creo y muestro la lista de coincidencias
  if (coincidencias.length > 0) {
    const listaCoincidencias = document.createElement("ul");
    listaCoincidencias.classList.add("ulEjercicios");

    coincidencias.forEach((ejercicio) => {
      const itemLista = document.createElement("li");
      itemLista.classList.add("liEjercicios");

      itemLista.textContent = ejercicio.nombre;

      itemLista.addEventListener("click", () => {
        ejercicios.value = ejercicio.nombre;
        divResultados.innerHTML = "";
      });

      listaCoincidencias.appendChild(itemLista);
    });

    divResultados.appendChild(listaCoincidencias);
    const listaCoincidenciasTeclado = document.querySelector(".ulEjercicios");
    let indiceSeleccionado = -1;

    ejercicios.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        // Mover la selección hacia arriba en la lista
        indiceSeleccionado = Math.max(indiceSeleccionado - 1, 0);

        actualizarSeleccion();
      } else if (event.key === "ArrowDown") {
        // Mover la selección hacia abajo en la lista
        indiceSeleccionado = Math.min(
          indiceSeleccionado + 1,
          listaCoincidenciasTeclado.children.length - 1
        );
        actualizarSeleccion();
      } else if (event.key === "Enter") {
        const seleccionado = document.querySelector(".liEjercicioSeleccionado");
        if (seleccionado) {
          ejercicios.value = seleccionado.textContent;
          divResultados.innerHTML = "";
        }
      } else if (event.key === "Tab") {
        const seleccionado = document.querySelector(".liEjercicioSeleccionado");
        if (seleccionado) {
          ejercicios.value = seleccionado.textContent;
          divResultados.innerHTML = "";
        }
      }
    });
    // Función para actualizar la selección en la lista
    function actualizarSeleccion() {
      // Remover la clase 'seleccionado' de todos los elementos de la lista
      Array.from(listaCoincidenciasTeclado.children).forEach((item, index) => {
        if (index === indiceSeleccionado) {
          item.classList.add("seleccionado");
          item.classList.replace("liEjercicios", "liEjercicioSeleccionado");
          ejercicios.value = item.textContent;
        } else {
          item.classList.replace("liEjercicioSeleccionado", "liEjercicios");
          item.classList.remove("seleccionado");
        }
      });
    }
  }
});

//Arreglo para ir subiendo los ejercicios que asigno a la rutina
const ejerciciosRutina = [];

agregarEjercicio.addEventListener("click", function () {
  if (ejercicios.value === " " || seriesRepeticiones.value === "") {
    if (ejercicios.value === "") {
      alert("No ha ingresado ejercicio");
    } else {
      alert("No ha ingresado series y repeticiones ");
    }
  } else {
    //Buscao por indice la coincidicencia que existe en el array de los ejercicios
    const ejercicio = ejercicios.value.toUpperCase();
    const indice = bd.ejerciciosBD.findIndex((el) => el.nombre === ejercicio);

    ingresoRutina.innerHTML += `<div class="ejercicio">
    <p class="musculoEjercicio">${bd.ejerciciosBD[indice].musculo}</p>
      <p class="tituloEjercicio">${bd.ejerciciosBD[indice].nombre}</p>
      <p class="dato" >${seriesRepeticiones.value}</p>
      
      <p> ${observaciones.value}</p>
      <a class="enlacesEjercicio" href="${bd.ejerciciosBD[indice].video}" target="_blank"><img class="imagenV" src="https://www.svgrepo.com/show/520494/video-course.svg" alt="icono video"/></a>
      <a href="#" class="btnQuitar enlacesEjercicio" data-id="${bd.ejerciciosBD[indice].id}"><img class="imagenX" src="/assets/images/close.svg" alt="icono de una x"/></a>
    </div>`;

    //Necesito un botón eliminar para sacar de a un ejercicio si fuera necesario
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    //Recorro los botones existentes para crear el evento

    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();

        const idEjercicio = Number(boton.dataset.id);
        const ejercicioAEliminar = document.querySelector(
          `[data-id="${idEjercicio}"]`
        );
        if (ejercicioAEliminar) {
          ingresoRutina.removeChild(ejercicioAEliminar.parentElement);
          // Eliminar el ejercicio de ejerciciosRutina
          const indiceAEliminar = ejerciciosRutina.findIndex(
            (el) => el.id === idEjercicio
          );
          if (indiceAEliminar !== -1) {
            ejerciciosRutina.splice(indiceAEliminar, 1);
          }
        }
      });
    }
  }
  ejercicios.value = "";
  seriesRepeticiones.value = "";
  observaciones.value = "";
});

document
  .getElementById("generarDocumento")
  .addEventListener("click", async () => {
    // Obtener la sección muestra_rutina
    const muestraRutina = document.getElementById("muestra_rutina");

    // Clonar la sección para manipularla sin afectar el DOM original
    const nuevaSeccion = muestraRutina.cloneNode(true);

    // Obtener todas las imágenes dentro de la nueva sección
    const imagenes = nuevaSeccion.querySelectorAll(".imagenX");

    // Filtrar las imágenes que no sean close.svg y eliminarlas
    for (let i = 0; i < imagenes.length; i++) {
      if (imagenes[i].src.includes("close.svg")) {
        imagenes[i].parentNode.removeChild(imagenes[i]);
      }
    }
    const idProfesor = profesor.getAttribute("data-id");
    const idAlumno = uid.getAttribute("data-id");

    const apellidoSpan = document.querySelector(".apellido_span");
    const nombreSpan = document.querySelector(".nombre_span");

    //Tomar datos del host

    const protocol = window.location.protocol;
    const host = window.location.host;

    // Crear un nuevo documento HTML con el contenido filtrado
    const nuevoDocumento =
      "<!DOCTYPE html>" +
      "<html lang='en'>" +
      "<head>" +
      "<meta charset='UTF-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
      "<link rel='shortcut icon' href='https://icons8.com/icon/65485/barbell' type='image/x-icon'>" +
      `<title> 
      Rutina de: ${apellidoSpan.textContent} 
      ${nombreSpan.textContent} 
      </title>
      <style>
      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      background-color: black;
      color: white;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    header{
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      align-items:center;
      margin-right:10px;
    }

    .logo_shadow{
      width:300px;
      height:150px;
      margin-left:20px;
    }
    main {
      color: white;
    }

   .h2_dia {
      background-color: white;
      color: black;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap:10px; 
      align-items: space-around;
      padding: 5px;
      margin: 5px;
    }

    .datos_actuales {
      display: flex;
      flex: row;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid white;
      padding: 5px;
      margin: 5px;
      text-align: center;
    }
    .fecha_nombre {
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .nombre_apellido {
      font-weight: 500;
    }
    
.imagen_perfil {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 5px;
  
}
.ejercicio {
  background-image: linear-gradient(to right, #a4161a, #161a1d);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
}

.ejercicio p{
  width: 20%; 
  
}

.tituloEjercicio{
  font-weight: bolder;
}

.dato{
  font-style: italic;
  }
.imagenV {
  width: 50px;
  height: 50px;
}
.h3_circuito {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(167, 158, 158);
 
  margin: 5px;
  
}




.btnQuitar{
  display: none;
} 


    
      </style>` +
      "</head>" +
      `<body> 
      <header>
      <img class="logo_shadow" src="https://i.ibb.co/4WsHDQX/Artboard-1-copy-8.png"/><div><h1>RUTINA DE ENTRENAMIENTO</h1></header>
      <main>
      <section id="muestra_rutina">
      ${nuevaSeccion.innerHTML}
      </section>
      </main>
      <footer><a href="${protocol}//${host}/api/users/perfil/${idAlumno}">Ir a perfil</a></footer>
      </body> 
      </html>`;

    const documentoProfesor =
      "<!DOCTYPE html>" +
      "<html lang='en'>" +
      "<head>" +
      "<meta charset='UTF-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
      "<link rel='shortcut icon' href='https://icons8.com/icon/65485/barbell' type='image/x-icon'>" +
      `<title> 
      Rutina de: ${apellidoSpan.textContent} 
      ${nombreSpan.textContent} 
      </title>
      <style>
      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      background-color: black;
      color: white;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    header{
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      align-items:center;
      margin-right:10px;
    }

    .logo_shadow{
      width:300px;
      height:150px;
      margin-left:20px;
    }
    main {
      color: white;
    }

   .h2_dia {
      background-color: white;
      color: black;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap:10px; 
      align-items: space-around;
      padding: 5px;
      margin: 5px;
    }

    .datos_actuales {
      display: flex;
      flex: row;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid white;
      padding: 5px;
      margin: 5px;
      text-align: center;
    }
    .fecha_nombre {
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .nombre_apellido {
      font-weight: 500;
    }
    
.imagen_perfil {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 5px;
  
}
.ejercicio {
  background-image: linear-gradient(to right, #a4161a, #161a1d);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
}

.ejercicio p{
  width: 20%; 
  
}

.tituloEjercicio{
  font-weight: bolder;
}

.dato{
  font-style: italic;
  }
.imagenV {
  width: 50px;
  height: 50px;
}
.h3_circuito {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(167, 158, 158);
 
  margin: 5px;
  
}




.btnQuitar{
  display: none;
} 


    
      </style>` +
      "</head>" +
      `<body> 
      <header>
      <img class="logo_shadow" src="https://i.ibb.co/4WsHDQX/Artboard-1-copy-8.png"/><div><h1>RUTINA DE ENTRENAMIENTO</h1></header>
      <main>
      <section id="muestra_rutina">
      ${nuevaSeccion.innerHTML}
      </section>
     
      </main>
      <footer><a href="${protocol}//${host}/api/users/perfil/profesor/${idProfesor}">Ir a perfil</a></footer>
      <script src="/js/rutina.js"></script>
      </body> 
      </html>`;

    // // Convertir el contenido a un Blob
    // const blob = new Blob([nuevoDocumento], { type: "text/html" });

    // // Crear un enlace para la descarga
    // const link = document.createElement("a");
    // link.href = window.URL.createObjectURL(blob);
    // link.download = `rutina_${apellidoSpan.textContent.toLowerCase()}_${nombreSpan.textContent.toLowerCase()}.html`;

    // // Simular clic en el enlace para iniciar la descarga
    // link.click();

    let bodyPropiedad = {
      fecha: fechaRutina,
      vistaAlumno: nuevoDocumento,
      vistaProfesor: documentoProfesor,
    };

    const response = await fetch(`/api/users/cargarrutina/${idAlumno}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rutina: bodyPropiedad }),
    });
    const result = await response.json();

    if (response.ok) {

      const guardado = document.querySelector(".guardado")
      const nuevoDiv = document.createElement("div");
      nuevoDiv.classList.add("aviso")
      nuevoDiv.textContent = "Rutina creada correctamente";
      

      const botonAviso = document.createElement("button")
      botonAviso.classList.add("botonAviso")
      botonAviso.textContent = "Aceptar"

      botonAviso.addEventListener("click",()=>{
        window.location.reload();
      })
      muestraRutina.innerHTML = ""
      nuevoDiv.appendChild(botonAviso)
      muestraRutina.appendChild(nuevoDiv)
      guardado.innerHTML = ""


    }
  });

//Hago que el button eliminar borre todo el contenido de la rutina

const borrarRutnia = document.querySelector("#borrarRutina");

borrarRutnia.addEventListener("click", () => {
  localStorage.removeItem("contenido_rutina");
  ingresoFecha.innerHTML = "";
  ingresoRutina.innerHTML = "";
  location.reload();
});

// Guardado de rutina provisorio

const guardarRutina = document.querySelector("#guardarRutina");
const uid = document.querySelector("#nombreAlumno");

// guardarRutina.addEventListener("click", async (e) => {
//   e.preventDefault();
//   const idAlumno = uid.getAttribute("data-id");
//   const response = await fetch(`/api/users/cargarrutina/${idAlumno}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ rutina: muestraRutina.innerHTML }),
//   });
//   const result = await response.json();

//   if (response.ok) {
//     console.log(result);
//     // window.location.reload();
//   }
// });

guardarRutina.addEventListener("click", () => {
  let contenidoHTML = muestraRutina.innerHTML;
  localStorage.setItem("contenido_rutina", contenidoHTML);
});
