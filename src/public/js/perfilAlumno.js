const lista = document.querySelector("#profesores");
const selectProfesor = document.querySelector("#select_profesor");
const uid = document.querySelector("#usuario_id");
const archivo = document.querySelector(".archivo");
const labelFoto = document.querySelector(".inputFoto");
if (selectProfesor) {
  selectProfesor.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = uid.getAttribute("data-id");
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

archivo.addEventListener("change", function (e) {
  const fileInput = e.target;
  if (fileInput.files.length > 0) {
    labelFoto.textContent = "Cambiar foto";
  } else {
    labelFoto.textContent = "Elegir foto";
  }
});
