const puppeteer = require("puppeteer");
const UserManager = require("../dao/classes/users.dao.js");

const userService = new UserManager();

async function crearRutina(url) {
  // Abrir navegador
  let navegador = await puppeteer.launch();

  // Creamos una nueva pestaña o pagina
  let pagina = await navegador.newPage();

  // Abrir al url dentro de esta pagina
  await pagina.goto(url, { waitUntil: "networkidle2" });
  // Mostramos los estilos en la nueva página
  await pagina.emulateMediaType("screen");
  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await pagina.pdf({ format: "A4", printBackground: true });

  // VAmos a crear nuestro PDF

  // Cerramos el navegador

  await navegador.close();
  return pdfBuffer;
}

module.exports = {
  crearRutina,
};
