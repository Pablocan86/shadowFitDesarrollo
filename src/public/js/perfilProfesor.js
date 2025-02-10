const archivo = document.querySelector(".archivo");
const labelFoto = document.querySelector(".inputFoto");
const infoAlumno = document.querySelectorAll(".infoAlumno");
const infoCuadro = document.getElementById("infoCuadro");
const creaRutina = document.querySelectorAll(".crearRutina");
const infoRutina = document.getElementById("crea_Rutina");

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
