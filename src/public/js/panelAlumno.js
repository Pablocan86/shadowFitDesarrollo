const usuario = document.getElementById("usuario_id");

const idAlumno = usuario.getAttribute("data-id");

fetch(`/api/users/ver-foto-perfil-alumno/${idAlumno}`)
  .then((response) => response.json())
  .then((data) => {
    // La URL está en data.url
    const imageUrl = data.url;

    // Actualizar el atributo src de la imagen
    const imgElement = document.getElementById("imagenID");
    imgElement.src = imageUrl;
  })
  .catch((error) => {
    console.error("Error al obtener la imagen de perfil:", error);
  });
