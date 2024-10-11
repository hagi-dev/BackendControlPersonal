// index.js
const { Worker } = require('worker_threads');
const path = require('path');

// Función para crear un nuevo worker y enviar correo
const sendEmailInParallel = (emailOptions) => {
  console.log('emailOptions', emailOptions);
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'emailWorker.js'));

    worker.on('message', (message) => {
      if (message.status === 'success') {
        resolve(message.result);
      } else {
        reject(message.error);
      }
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    worker.postMessage(emailOptions);
  });
};

module.exports = sendEmailInParallel;

// Ejemplo de uso
// const emailOptions = {
//   from: 'tu-email@gmail.com',
//   to: 'destinatario@gmail.com',
//   subject: 'Asunto del correo',
//   text: 'Contenido del correo'
// };

// sendEmailInParallel(emailOptions)
//   .then((result) => {
//     console.log('Correo enviado:', result);
//   })
//   .catch((error) => {
//     console.error('Error al enviar correo:', error);
//   });