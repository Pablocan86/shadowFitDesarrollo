// const puppeteer = require("puppeteer");
const { chromium } = require("playwright");
const puppeteer = require("puppeteer");
const UserManager = require("../dao/classes/users.dao.js");
const { uploadFile } = require("../config/s3.js");

const userService = new UserManager();

async function crearRutina(contenido) {
  if (
    !contenido ||
    typeof contenido !== "string" ||
    !contenido.startsWith("http")
  ) {
    console.error("URL no válida:", contenido);
    return;
  }
  // Abrir navegador
  let navegador = await puppeteer.launch();

  // Creamos una nueva pestaña o pagina
  let pagina = await navegador.newPage();
  // Abrir al url dentro de esta pagina
  await pagina.goto(contenido, { waitUntil: "networkidle2" });
  // await pagina.setContent(contenido, { waitUntil: "domcontentloaded" });
  // Mostramos los estilos en la nueva página

  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await pagina.pdf({
    format: "A4",
    printBackground: true,
  });

  // Cerramos el navegador

  await navegador.close();
  return pdfBuffer;
}

async function crearPDF(contenido) {
  // Abrir navegador
  let navegador;
  try {
    navegador = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error) {
    console.log("Could not create a browser intance => : ", error);
  }

  // Creamos una nueva pestaña o pagina
  let pagina = await navegador.newPage();
  // Abrir al url dentro de esta pagina

  await pagina.setContent(contenido, { waitUntil: "domcontentloaded" });
  // Mostramos los estilos en la nueva página

  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await pagina.pdf({
    printBackground: true,
  });

  // Cerramos el navegador

  await navegador.close();
  return pdfBuffer;
}

module.exports = {
  crearRutina,
  crearPDF,
};
