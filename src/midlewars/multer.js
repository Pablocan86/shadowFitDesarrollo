const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const {
  AWS_BUCKET_NAME,
  AWS_SECRET__KEY,
  AWS_PUBLIC_KEY,
  AWS_BUCKET_REGION,
} = require("../config/variables.js");
const path = require("path");

// Configurar el cliente de S3
const s3 = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET__KEY,
  },
});

const storage = multerS3({
  s3: s3,
  bucket: AWS_BUCKET_NAME, // Nombre de tu bucket en S3
  key: function (req, file, cb) {
    // Crear un nombre único para el archivo (puedes cambiar la lógica si deseas)
    const fileName = `foto_perfil_${Date.now()}_${file.originalname}`;
    cb(null, fileName); // El archivo será subido con este nombre
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen."));
    }
    cb(null, true); // Aceptar el archivo
  },
});

const storage2 = multerS3({
  s3: s3,
  bucket: AWS_BUCKET_NAME, // Nombre de tu bucket en S3
  key: function (req, file, cb) {
    // Crear un nombre único para el archivo (puedes cambiar la lógica si deseas)

    const customName = file.originalname;
    const fileName = `${customName}_${Date.now()}.jpg`;
    cb(null, fileName); // El archivo será subido con este nombre
  },
});

const upload2 = multer({
  storage: storage2,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen."));
    }
    cb(null, true); // Aceptar el archivo
  },
});

module.exports = { upload, upload2 };

// const multer = require("multer");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (/^image\//.test(file.mimetype)) {
//     cb(null, true); // Aceptar archivos de imagen
//   } else {
//     cb(new Error("Solo se permiten archivos de imagen"), false); // Rechazar otros tipos
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;
