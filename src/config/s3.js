const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  AWS_BUCKET_NAME,
  AWS_SECRET__KEY,
  AWS_PUBLIC_KEY,
  AWS_BUCKET_REGION,
} = require("./variables.js");
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET__KEY,
  },
});

async function uploadFile(fileBuffer, fileName) {
  // const stream = fs.createReadStream(file.tempFilePath);
  // const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/pdf",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    console.log("Archivo subido con exito", fileName);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error al subir el archivo a S3", error);
    throw error;
  }
}

async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });
  return await client.send(command);
}

// export async function getFile(fileName) {
//   const command = new GetObjectCommand({
//     Bucket: AWS_BUCKET_NAME,
//     Key: fileName,
//   });

//   return await client.send(command);
// }

async function downloadFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });

  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream(`./images/${fileName}`));
}

async function getFileURL(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  getFileURL,
};
