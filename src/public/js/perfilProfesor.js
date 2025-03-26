const archivo = document.querySelector(".archivo");
const labelFoto = document.querySelector(".inputFoto");
const infoAlumno = document.querySelectorAll(".infoAlumno");
const infoCuadro = document.getElementById("infoCuadro");
const creaRutina = document.querySelectorAll(".crearRutina");
const infoRutina = document.getElementById("crea_Rutina");
const uid = document.getElementById("usuario_id");
const listaAlumnos = document.querySelector(".listaAlumnosDiv");
const id = uid.getAttribute("data-id");

fetch(`/api/users/ver-foto-perfil-profesor/${id}`)
  .then((response) => response.json())
  .then((data) => {
    // La URL está en data.url
    const imageUrl = data.url;

    // Actualizar el atributo src de la imagen
    const imgElement = document.getElementById("imagenDePerfil");
    imgElement.src = imageUrl;
  })
  .catch((error) => {
    console.error("Error al obtener la imagen de perfil:", error);
  });

if (archivo) {
  archivo.addEventListener("change", function (e) {
    const fileInput = e.target;
    if (fileInput.files.length > 0) {
      labelFoto.textContent = "Cambiar foto";
    } else {
      labelFoto.textContent = "Elegir foto";
    }
  });
}

if (infoAlumno) {
  infoAlumno.forEach((imagen) => {
    const infoCuadro = imagen.nextElementSibling;
    imagen.addEventListener("mouseover", function () {
      infoCuadro.style.display = "block";
    });
    imagen.addEventListener("mouseout", function () {
      infoCuadro.style.display = "none";
    });
  });
}

if (creaRutina) {
  creaRutina.forEach((imagen) => {
    const infoRutina = imagen.nextElementSibling;
    imagen.addEventListener("mouseover", function () {
      infoRutina.style.display = "block";
    });
    imagen.addEventListener("mouseout", function () {
      infoRutina.style.display = "none";
    });
  });
}

Array.from(document.querySelectorAll(".divAlumno")).forEach((element) => {
  const id = element.id;
  fetch(`/api/users/ver-foto-perfil-alumno/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // La URL está en data.url
      const imageUrl = data.url;

      // Actualizar el atributo src de la imagen
      const imgElement = document.getElementById(`imgPerfil-${id}`);

      imgElement.src = imageUrl;
    })
    .catch((error) => {
      console.error("Error al obtener la imagen de perfil:", error);
    });
});
