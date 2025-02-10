const button = document.querySelector("#botonHola");

button.addEventListener("click", async () => {
  // Capturar el contenido HTML visible
  const content = document.documentElement.outerHTML;

  // Enviar el contenido HTML al servidor
  const response = await fetch("/api/views/createPDF", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: content }),
  });

  if (response.ok) {
    // Descargar el archivo PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    alert("Error al generar el PDF");
  }
  console.log("hola");
});
