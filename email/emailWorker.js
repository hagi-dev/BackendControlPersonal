// emailWorker.js
const { parentPort } = require('worker_threads');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transportador de nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
  }
});

// Función para enviar correo
const sendEmail = async (emailOptions) => {
  try {
    let info = await transporter.sendMail(emailOptions);
    return info;
  } catch (error) {
    console.log('Error al enviar correo: sendEmail', error);
    throw error;
  }
};

// Escuchar mensajes del hilo principal
parentPort.on('message', async (emailOptions) => {
  try {
    const result = await sendEmail(emailOptions);
    parentPort.postMessage({ status: 'success test jako', result });
  } catch (error) {
    console.log('Error al enviar correo: parentPort', error);
    parentPort.postMessage({ status: 'error test jako micgloving', error });
  }
});