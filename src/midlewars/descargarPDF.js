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
  let browser = await puppeteer.launch();

  // Creamos una nueva pestaña o pagina
  let page = await browser.newPage();
  // Abrir al url dentro de esta pagina
  await page.goto(contenido, { waitUntil: "networkidle2" });
  // await pagina.setContent(contenido, { waitUntil: "domcontentloaded" });
  // Mostramos los estilos en la nueva página

  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  // Cerramos el navegador

  await browser.close();
  return pdfBuffer;
}

async function crearPDF(contenido) {
  // Abrir navegador
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error) {
    console.log("Could not create a browser intance => : ", error);
  }

  // Creamos una nueva pestaña o pagina
  let page = await browser.newPage();
  // Abrir al url dentro de esta pagina

  await page.setContent(contenido, { waitUntil: "domcontentloaded" });
  // Mostramos los estilos en la nueva página
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return;
        return new Promise((resolve) => {
          img.onload = img.onerror = resolve;
        });
      })
    );
  });
  // let pdf = await pagina.pdf();
  // Generar el PDF y guardarlo en el disco
  let pdfBuffer = await page.pdf({
    printBackground: true,
  });

  // Cerramos el navegador

  await browser.close();
  return pdfBuffer;
}

module.exports = {
  crearRutina,
  crearPDF,
};
