const express = require("express");
const usersRouter = require("./routes/users.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/api/session.router.js");
const paymentRouter = require("./routes/payment.routes.js");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { transport } = require("./config/mailConfig.js");
const fileUpload = require("express-fileupload");
const { uploadFile, getFiles, getFileURL } = require("./config/s3.js");
const puppeteer = require("puppeteer");

//PDF
const { crearPDF } = require("./midlewars/descargarPDF.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const httpSever = app.listen(port, "0.0.0.0", () =>
  console.log(`Listeninig on PORT ${port}`)
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

// app.get("/files", async (req, res) => {
//   const result = await getFiles();
//   res.json(result.Contents);
// });

// app.post("/files", async (req, res) => {
//   const prueba = "<h1>hola</h1>";
//   const nombreArchivo = "pija2.pdf";
//   const result = await crearPDF(prueba, nombreArchivo);
//   const resultado = await uploadFile(result, nombreArchivo);
//   console.log(resultado);
//   res.send({ message: "subida exitos" });
// });

// app.get("/files/:fileName", async (req, res) => {
//   const result = await getFileURL(req.params.fileName);
//   // await decargar;
//   res.redirect(result);
// });

const socketServer = new Server(httpSever);
//Secreto
app.use(cookieParser(/*Tiene que ir una frase secreta*/));
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: "shadowFit86",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
//Permite leer datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error en la conexión", error);
  }
};

connectMongoDB();

// app.get("/mail", async (req, res) => {
//   let result = await transport.sendMail({
//     from: "Shadow Fit <shadowfit.info@gmail.com",
//     to: "pablo.cantarin86@gmail.com",
//     subject: "Correo prueba",
//     html: `<h1>HOLA PROBANDO</h1>`,
//   });
//   res.send({ correo: "Correo enviado" });
// });

app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/views", viewsRouter);
app.use("/api/session", sessionRouter);

// console.log("Ruta actual:", __dirname);
console.log("Ruta del navegador:", puppeteer.executablePath());

// app.listen(PORT, () => console.log(`Server runninng on PORT:${PORT}`));
