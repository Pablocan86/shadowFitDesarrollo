const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "shadowfit.info@gmail.com",
    pass: process.env.mailKey,
  },
});

module.exports = { transport };
