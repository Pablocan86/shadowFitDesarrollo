document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const form = document.querySelector("#formCambioContrasena");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const contrasenaActual = document.getElementById("contrasenaActual").value;
    const contrasenaNueva = document.getElementById("contrasenaNueva").value;
    const uid = form.action.split("/").pop(); // Extrae el UID de la URL del form

    try {
      const response = await fetch(`/api/users/cambiarcontrasena/${uid}`, {
        method: "PUT", // Usamos PUT en lugar de POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contrasenaActual: contrasenaActual,
          contrasenaNueva: contrasenaNueva,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const divAviso = document.createElement("div");
        divAviso.id = "divAviso";
        divAviso.innerHTML = `<p>${data.message}</p><button id="btnCerrarAviso">Aceptar</button>`;
        form.appendChild(divAviso);
        if (divAviso) {
          const button = document.querySelector("#btnCerrarAviso");
          button.addEventListener("click", async () => {
            divAviso.remove();
            const res = await fetch(`/api/session/logout`, {
              method: "POST", // Usamos PUT en lugar de POST
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (res.ok) {
              window.location = "/api/views/login";
            }
          });
        }
      } else {
        alert(`Error: ${data.message}`); // Muestra mensaje de error
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error en la conexión con el servidor");
    }
  });
});
