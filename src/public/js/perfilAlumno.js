const lista = document.querySelector("#profesores");
const selectProfesor = document.querySelector("#select_profesor");
const uid = document.querySelector("#usuario_id");
const uidProfesor = document.querySelector("#id_Profesor");
const archivo = document.querySelector(".archivo");
const labelFoto = document.querySelector(".inputFoto");

const id = uid.getAttribute("data-id");
const idProfesor = uidProfesor.getAttribute("data-id");

fetch(`/api/users/ver-foto-perfil-alumno/${id}`)
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

if (selectProfesor) {
  selectProfesor.addEventListener("click", async (e) => {
    e.preventDefault();
    // const id = uid.getAttribute("data-id");
    const pid = lista.value;

    const response = await fetch(`/api/users/cargarprofesor/${id}/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (response.ok) {
      window.location.reload();
    }
  });
}

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
fetch(`/api/users/ver-foto-perfil-profesor/${idProfesor}`)
  .then((response) => response.json())
  .then((data) => {
    // La URL está en data.url
    const imageUrl = data.url;

    // Actualizar el atributo src de la imagen
    const imgElement = document.getElementById("imgProfesor");
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
