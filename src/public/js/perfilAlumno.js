const lista = document.querySelector("#profesores");
const selectProfesor = document.querySelector("#select_profesor");
const uid = document.querySelector("#usuario_id");
const uidProfesor = document.querySelector("#id_Profesor");
const archivo = document.querySelector(".archivo");
const labelFoto = document.querySelector(".inputFoto");
const fotoFrente = document.querySelector("#fotoFrente");
const fotoPerfil = document.querySelector("#fotoPerfil");
const fotoEspalda = document.querySelector("#fotoEspalda");
const formProgresos = document.querySelector("#formProgresos");
const botonProgresos = document.querySelector("#buttonProgresos");
const fechaProgreso = document.querySelector("#fechaProgreso");

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

fotoFrente.addEventListener("change", (e) => {
  const nameFile = e.target.files[0].name;
  const label = document.getElementById("labelFrente");
  label.textContent = nameFile;
});

fotoEspalda.addEventListener("change", (e) => {
  const nameFile = e.target.files[0].name;
  const label = document.getElementById("labelEspalda");
  label.textContent = nameFile;
});

fotoPerfil.addEventListener("change", (e) => {
  const nameFile = e.target.files[0].name;
  const label = document.getElementById("labelPerfil");
  label.textContent = nameFile;
});

formProgresos.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fecha = new Date(fechaProgreso.value);
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formData = new FormData();
  formData.append("fechaProgreso", fechaFormateada);
  formData.append("fotoFrente", fotoFrente.files[0]);
  formData.append("fotoPerfil", fotoPerfil.files[0]);
  formData.append("fotoEspalda", fotoEspalda.files[0]);

  const response = await fetch(`/api/users/subirprogresos/${id}`, {
    method: "PUT",
    body: formData,
  });
  const data = await response.json();

  if (response.ok) {
    alert(data.message);
    window.location.reload();
  }
});

document.querySelectorAll("#listaProgresos img").forEach((img, index) => {
  const idUnico = Date.now() * 1000 + index;
  img.id = `${idUnico}`;
  const nombreArchivo = img.getAttribute("name");
  if (nombreArchivo) {
    fetch(`/api/users/fotoprogreso/${id}/${nombreArchivo}`)
      .then((response) => response.json())
      .then((data) => {
        // La URL está en data.url
        const imageUrl = data.url;

        // Actualizar el atributo src de la imagen
        const imgElement = document.getElementById(`${idUnico}`);
        imgElement.src = imageUrl;
      })
      .catch((error) => {
        console.error("Error al obtener la imagen de perfil:", error);
      });
  }
});
