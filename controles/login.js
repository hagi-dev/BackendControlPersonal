const pool = require("../src/database");
const jwt = require("jsonwebtoken");
const keys = require("../src/keys");

exports.login = async (req, res) => {
  //login para el sistema
  const { usuario, contraseña } = req.body;
  const query = `select InicioSesionAES(?,?) as valor`;
  const prueba = await pool.query(query, [usuario, contraseña]);
  if (prueba[0].valor === 1) {
    const payload = {
      check: true,
    };
    const token = jwt.sign(payload, keys.key, {
      expiresIn: "1d",
    });
    res.json({
      token: token,
      message: "usuario y contraseña correctos",
      usuario: usuario,
    });
  } else {
    res.status(401).json({ message: "usuario y contraseña incorrectos" });
  }
};
