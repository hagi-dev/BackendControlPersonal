const pool = require("../src/database");
const jwt = require("jsonwebtoken");
const keys = require("../src/keys");
const emailSend = require("../email/index");

const ALLOWED = {
  ADMIN: 1,
  USER: 2,
};

exports.login = async (req, res) => {
  //login para el sistema
  const { dni, contrasena } = req.body;
  const query = `select * from personal where PER_dni = ? and PER_contrasena = ? limit 1`;
  const [rows] = await pool.query(query, [dni, contrasena]);
  if (rows) {
    if (rows.TTR_id !== ALLOWED.ADMIN) {
      return res
        .status(200)
        .json({
          message: "no tienes permiso de entrar en el sistema",
          ok: false,
        });
    }
    const payload = {
      check: true,
    };
    const token = jwt.sign(payload, keys.key, {
      expiresIn: "1d",
    });
    res.json({
      token: token,
      message: "usuario y contraseña correctos",
      usuario: rows.PER_nombre,
      ok: true,
    });
  } else {
    res
      .status(200)
      .json({ message: "usuario y contraseña incorrectos", ok: false });
  }
};

exports.recovery = async (req, res) => {
  //recuperar contraseña
  try {
    const { dni } = req.body;
    const query = `select * from personal where PER_dni = ?`;
    const [rows] = await pool.query(query, [dni]);
    if (rows) {
      await emailSend({
        from: "hagiraitorresmacedo@gmail.com",
        to: "j4ko.dele@gmail.com",
        subject: "recuperacion de contrasena jako puta",
        html: `<!-- emailTemplate.html -->
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Recuperación de Contraseña</title>
                  <style>
                    .container {
                      font-family: Arial, sans-serif;
                      margin: 0 auto;
                      padding: 20px;
                      max-width: 600px;
                      background-color: #f4f4f4;
                      border-radius: 8px;
                    }
                    .header {
                      text-align: center;
                      padding: 10px 0;
                      background-color: #007bff;
                      color: white;
                      border-radius: 8px 8px 0 0;
                    }
                    .content {
                      padding: 20px;
                      background-color: white;
                      border-radius: 0 0 8px 8px;
                    }
                    .button {
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      background-color: #007bff;
                      color: white;
                      text-decoration: none;
                      border-radius: 5px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Recuperación de Contraseña</h1>
                    </div>
                    <div class="content">
                      <p>Hola,</p>
                      <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                      <a href="http://localhost:80/recovery-password?dni=${rows.PER_dni}&token="iokjdwqesaiojkdsfackolijdsfcklijdcfskljidsfcakjildsackljsdaccdsijo" class="button">Restablecer Contraseña</a>
                      <p>Si no solicitaste un cambio de contraseña, por favor ignora este correo.</p>
                      <p>Gracias,</p>
                      <p>El equipo de soporte</p>
                    </div>
                  </div>
                </body>
                </html>`,
      });
      res.json({ message: "Correo enviado", ok: true });
    } else {
      res.status(401).json({ message: "usuario no encontrado", ok: false });
    }
  } catch (error) {
    if(error){
      res.status(401).json({ message: "hubo un error", ok: false });
    }else{
      res.status(200).json({ message: "Correo enviado", ok: true });
    }
  }
};
