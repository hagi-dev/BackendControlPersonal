const { send } = require("express/lib/response");
const pool = require("../src/database");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//list of personal
exports.list = (req, res) => {
  const query = `CALL SP_CRUD_CONTRATO (?,?,?,?,?,?,?)`;
  const prueba = pool.query(
    query,
    ["S", null, null, null, null, null, null],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
};

exports.list3 = async (req, res) => {
  const query = `
      SELECT 
        contrato.CON_id AS contratoId,
        CON_estado AS estado,
        CONCAT(horario.HOR_detalle, ': ', horario.HOR_entrada, ' - ', horario.HOR_salida, ': L-V') AS horario,
        personal.PER_dni AS dni,
        CONCAT(personal.PER_nombre, ' ', personal.PER_apaterno) AS nombre,
        tipo_trabajador.TTR_descripcion AS cargo,
        (SELECT id FROM contrato_archivos WHERE contrato_id = contrato.CON_id ORDER BY id DESC LIMIT 1) AS lastContractFileId,
        (SELECT fecha_inn FROM contrato_archivos WHERE contrato_id = contrato.CON_id ORDER BY id DESC LIMIT 1) AS fecha_inn,
        (SELECT fehcha_out FROM contrato_archivos WHERE contrato_id = contrato.CON_id ORDER BY id DESC LIMIT 1) AS fecha_out
      FROM contrato
      INNER JOIN contrato_horario ON contrato.CON_id = contrato_horario.CON_id
      iNNER JOIN horario ON contrato_horario.HOR_id = horario.HOR_id
      INNER JOIN personal ON contrato.PER_id = personal.PER_id
      INNER JOIN tipo_trabajador ON personal.TTR_id = tipo_trabajador.TTR_id
      ORDER BY contrato.CON_id;
    `;

  try {
    const rows = await pool.query(query);
    const contratos = rows.map((row) => ({
      ...row,
      estado: new Date(row.fecha_out) > new Date() ? "Activo" : "Terminado",
    })
    );
    res.json(contratos);
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: "Error al obtener contratos" });
  }
};

exports.horarios = (req, res) => {
  const { id } = req.params;

  const query = `select HOR_id from contrato_horario where CON_id=?`;
  const prueba = pool.query(query, [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
};

exports.id = (req, res) => {
  const { id } = req.params;
  const query = `select * from contrato where PER_id=?`;
  pool.query(query, [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
};

exports.fullContract = async (req, res) => {
  // obtener el contrato y su horario y archivos de contrato con un inner join traer todos los campos
  const { idContrato } = req.params;
  const query = `SELECT contrato.*, contrato_horario.HOR_id, personal.PER_dni
    FROM contrato
    LEFT JOIN personal ON contrato.PER_id = personal.PER_id
    LEFT JOIN contrato_horario ON contrato.CON_id = contrato_horario.CON_id
    WHERE contrato.CON_id = ?`;

  try {
    await pool.query(query, [idContrato], (err, rows, fields) => {
      if (!err) {
        res.json(
          rows.map((row) => {
            return {
              idContrato: row.CON_id,
              estado: row.CON_estado,
              idHorario: row.HOR_id,
              dni: row.PER_dni,
            };
          })
        );
      } else {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error al obtener contrato" });
  }
};

exports.validateDate = async (req, res) => {
  const { dni } = req.params;

  try {
    console.log(dni);
    const query = `select PER_id from personal where PER_dni=?`;
    const query2 = `select CON_fecha_out from contrato where PER_id=? order by CON_fecha_out desc `;
    const [rows] = await pool.query(query, dni);
    const prueba2 = await pool.query(query2, [rows[0].PER_id]);
    await res.json(prueba2.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

//======================================================================================================================
exports.insert = async (req, res) => {
  const { personalId, fechaInicioContrato, fechaFinContrato, idHorario } =
    req.body;
  const file = req.file ? req.file.buffer.toString("base64") : null;
  const query = "insert into contrato (CON_estado, PER_id) values ('a' , ?)";
  const query2 = "insert into contrato_horario (CON_id, HOR_id) values (?, ?)";
  const query3 =
    "insert into contrato_archivos (contrato_id, file, fecha_inn, fehcha_out) values (?, ?, ?, ?)";

  try {
    const result = await pool.query(query, personalId);
    const contratoId = result.insertId;

    await pool.query(query2, [contratoId, idHorario]);
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${file}`);

      const fileUrl = uploadResult.secure_url;
      await pool.query(query3, [
        contratoId,
        fileUrl,
        fechaInicioContrato,
        fechaFinContrato,
      ]);
    }

    res.json({
      status: true,
      message: "Contrato y archivos insertados correctamente",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Error al insertar contrato y archivos",
    });
  }
};

//======================================================================================================================

//======================================================================================================================
exports.update = async (req, res) => {
  const { fechaInicioContrato, fechaFinContrato, idHorario } = req.body;
  const { contratoId } = req.params;
  const file = req.file ? req.file.buffer.toString("base64") : null;

  const queryUpdateHorario =
    "UPDATE contrato_horario SET HOR_id = ? WHERE CON_id = ?";
  const queryInsertArchivo =
    "INSERT INTO contrato_archivos (contrato_id, file, fecha_inn, fehcha_out) VALUES (?, ?, ?, ?)";

  try {
    await pool.query(queryUpdateHorario, [idHorario, contratoId]);

    if (file && fechaInicioContrato && fechaFinContrato) {
      if (file) {
        const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${file}`);

        const fileUrl = uploadResult.secure_url;
        await pool.query(queryInsertArchivo, [
          contratoId,
          fileUrl,
          fechaInicioContrato,
          fechaFinContrato,
        ]);
      }
    }

    res.json({
      status: true,
      message: "Contrato actualizado correctamente",
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Error al actualizar contrato",
    });
  }
};

//======================================================================================================================

exports.delete = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM contrato WHERE CON_id = ?";
  await pool.query(query, [id], (err, rows, fields) => {
    if (!err) {
      res.json({ status: true, message: "Contrato eliminado" });
    } else {
      console.log(err);
      res.json({ status: false, message: "Error al eliminar contrato" });
    }
  });
};

// Función para subir archivos
exports.uploadContractFile = async (req, res) => {
  try {
    const { contratoId } = req.body;
    const odfFile = req.file.buffer;

    const query = `UPDATE contrato_archivos SET file = ? WHERE contrato_id = ?`;
    await pool.query(query, [odfFile, contratoId]);
    res.json({ status: true, message: "Archivo subido correctamente" });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error al subir archivo" });
  }
};

exports.deleteContractFile = async (req, res) => {
  try {
    const { contratoArchivoId } = req.params;
    const query = `DELETE FROM contrato_archivos WHERE id = ?`;
    await pool.query(query, [contratoArchivoId]);
    res.json({ status: true, message: "Archivo eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error al eliminar archivo" });
  }
};

exports.listContractFiles = async (req, res) => {
  try {
    const { contratoId } = req.params;
    const query = `SELECT * FROM contrato_archivos WHERE contrato_id = ?`;
    const rows = await pool.query(query, [contratoId]);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error al obtener archivos" });
  }
};

exports.verificationPersonalAndContract = async (req, res) => {
  const { dni } = req.params;
  const query = `select * from personal where PER_dni = ?`;
  const query2 = `select * from contrato where PER_id = ?`;
  pool.query(query, dni, (err, rows, fields) => {
    const per = rows[0];
    if (!err) {
      if (rows.length > 0) {
        pool.query(query2, rows[0].PER_id, (err, rows, fields) => {
          if (!err) {
            if (rows.length > 0) {
              res.json({
                status: false,
                message: "Ya tiene un area de contrato",
              });
            } else {
              res.json({
                status: true,
                message: "No tiene contrato",
                personalId: per.PER_id,
              });
            }
          } else {
            console.log(err);
            res.json({ status: false, message: "error al buscar contrato" });
          }
        });
      } else {
        res.json({ status: false, message: "No se encontró personal" });
      }
    } else {
      res.json({ status: false, message: "Error al buscar personal" });
    }
  });
};
