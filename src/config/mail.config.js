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

//Correo de verificación al registarse

const sendEmailVerification = async (email, subject, html) => {
  try {
    await transport.sendMail({
      from: `SHADOW FIT <shadowfit.info@gmail.com>`,
      to: email,
      subject,
      text: "Bienvenido a Shadow Fit",
      html,
    });
  } catch (error) {}
};

const getTemplate = (name, token, req) => {
  const baseUrl = `${req.protocol}://${req.headers.host}`;
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
  <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
     <h2 style="color: #333;">BIENVENIDO A <span style="color:#9222ff">SHADOW FIT</span></h2>
   
    <img style="width:100px, height:1.5rem;" src="https://firebasestorage.googleapis.com/v0/b/pfcantarin-reactjs.appspot.com/o/Artboard%201-8.png?alt=media&token=0e71c0ac-b657-45fe-95dd-394dea2eed3e" alt="Logo Shadow Fit">
     <h3 style="color: #333;">Hola ${name}</h3>
        <p style="color: #555; font-size: 16px;">
          Para confirmar tu cuenta, hacé clic en el siguiente botón:
        </p>
        <a 
          href="${baseUrl}/api/users/confirm/${token}" 
          style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #9222ff; color: white; text-decoration: none; border-radius: 5px;"
        >
          Confirmar cuenta
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">
          Si no solicitaste esta cuenta, podés ignorar este correo.
        </p>
    </div>
    </div>`;
};

module.exports = { transport, sendEmailVerification, getTemplate };
