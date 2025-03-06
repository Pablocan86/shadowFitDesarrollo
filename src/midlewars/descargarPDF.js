// const puppeteer = require("puppeteer");
const { chromium } = require("playwright");
const UserManager = require("../dao/classes/users.dao.js");

const userService = new UserManager();

async function crearRutina(contenido) {
  // Abrir navegador
  let navegador = await chromium.launch({
    headless: true,
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Creamos una nueva pestaña o pagina
  let pagina = await navegador.newPage();

  // Abrir al url dentro de esta pagina
  await pagina.goto(contenido);
  // await pagina.setContent(contenido, { waitUntil: "domcontentloaded" });
  // Mostramos los estilos en la nueva página

  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await pagina.pdf({
    path: "output.pdf",
    format: "A4",
    printBackground: true,
  });

  // Cerramos el navegador

  await navegador.close();
  return pdfBuffer;
}

crearRutina().catch(console.error);

module.exports = {
  crearRutina,
};
