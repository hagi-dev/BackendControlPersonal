const pool = require("../src/database");

exports.list = async (req, res) => {
  const query =
    "select TTR_id as id, TTR_descripcion as cargo, TTR_estado as estado from tipo_trabajador";
  try {
    await pool.query(query, "CC", (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
        res.json({ status: false, message: "error en la consulta" });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "error en la consulta" });
  }
};

exports.listContratoArea = async (req, res) => {
  const query =
    "select TTR_descripcion as area, TTR_id as id from tipo_trabajador";
  await pool.query(query, "CC", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
      res.json({ status: false, message: "error en la consulta" });
    }
  });
};

exports.listContratoCargo = async (req, res) => {
  const query =
    "select TTR_descripcion as cargo, TTR_id as id from tipo_trabajador";
  await pool.query(query, "CC", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
};

exports.listId = async (req, res) => {
  const { id } = req.params;
  const query =
    "select TTR_descripcion as 'area', TTR_cargo as 'cargo' from tipo_trabajador where TTR_id = ?";
  await pool.query(query, [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
};
//======================================================================================================================
exports.insert = async (req, res) => {
  const { cargo } = req.body;
  const query = "insert into tipo_trabajador (TTR_descripcion, TTR_estado) values (?, '1')";
  try {
    await pool.query(query, [cargo], (err, rows, fields) => {
      if (!err) {
        res.json({ status: true, message: "cargo registrado correctamente" });
      } else {
        console.log(err);
        res.json({ status: false, message: "error en el registro" });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "error en el registro" });
  }
};

//======================================================================================================================

exports.update = async (req, res) => {
  const { cargo, estado } = req.body;
  const { id } = req.params;
  const query =
    "UPDATE tipo_trabajador SET TTR_descripcion = ?, TTR_estado = ? WHERE TTR_id = ?";
  try {
    await pool.query(query, [cargo, estado, id], (err, rows, fields) => {
      if (!err) {
        res.json({ status: true, message: "cargo actualizado correctamente" });
      } else {
        console.log(err);
        res.json({ status: false, message: "error en la actualizacion" });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "error en la actualizacion" });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tipo_trabajador WHERE TTR_id = ?";
  try {
    await pool.query(query, [id], (err, rows, fields) => {
      if (!err) {
        res.json({ status: true, message: "cargo eliminado correctamente" });
      } else {
        console.log(err);
        res.json({ status: false, message: "error en la eliminacion" });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "error en la eliminacion" });
  }
};
