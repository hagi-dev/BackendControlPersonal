const pool = require("../src/database");

const TABLE_NAME = "personal";

exports.list = async (req, res) => {
  const fecha = new Date();
  console.log(fecha);
  const query = `SELECT PER_id as id,PER_dni as dni,PER_nombre as nombre,PER_apaterno 
    as apellidoPaterno,PER_amaterno as apellidoMaterno,PER_genero 
    as sexo,PER_fec_nacimiento as fechaNacimiento, PER_foto as "foto", PER_correo as correo, TTR_id as idTipoPersonal,
     PER_estado as estado , PER_direccion as direccion, PER_telefono as 
    telefono, TIMESTAMPDIFF(Year,PER_fec_nacimiento ,?) as edad FROM ${TABLE_NAME} where PER_estado=1`;
  await pool.query(query, [fecha], (err, rows, fields) => {
    if (!err) {
      res.json({
        ok: true,
        data: rows,
        message: "",
      });
    } else {
        console.log('responseeeee err',err);
      console.log(err);
    }
  });
};

exports.listId = async (req, res) => {
  const { id } = req.params;
  const query =
    "select * from personal where PER_estado=1 and PER_id=? limit 1";
  await pool.query(query, [id], (err, rows, fields) => {
    if (!err) {
      res.json({
        ok: true,
        data: rows,
        message: "personal encontrado",
      });
    } else {
      console.log(err);
    }
  });
};

exports.id = async (req, res) => {
  const { dni } = req.body;
  const query = "select * from personal where PER_dni=?";
  await pool.query(query, [dni], (err, rows, fields) => {
    if (!err) {
        console.log('responseeeee',rows);
      if(rows.length>0){
        res.json({
          ok: true,
          data: rows,
          message: "personal encontrado",
        });
      }else{
        res.json({
            ok: false,
            data: [],
            message: "no se encontro al personal",
          });
      }
    } else {
      console.error(err);
      res.json({
        ok: false,
        data: [],
        message: "no se encontro al personal",
      });
    }
  });
};
//======================================================================================================================
exports.insert = async (req, res) => {
  try {
    const {
        nombre,
        paterno,
        genero,
        materno,
        dni,
        url,
        telefono,
        direccion,
        fecha_nacimiento,
        idTipoPersonal,
        correo,
      } = req.body;
      //verificar si existe el personal
      const personalVerufy = await verifyPersonal(dni, correo);
      if (personalVerufy) {
        res.json({ status: false, message: "el personal ya existe", ok: false });
        return;
      }
      console.log("pasooooooo");
      const personalData = {
        PER_nombre: nombre,
        PER_apaterno: paterno,
        PER_amaterno: materno,
        PER_genero: genero,
        PER_fec_nacimiento: fecha_nacimiento,
        PER_foto: url,
        PER_telefono: telefono,
        PER_dni: dni,
        PER_direccion: direccion,
        PER_contrasena: dni,
        PER_correo: correo,
        TTR_id: idTipoPersonal,
      };
      const query = `insert into personal set ?`;
      await pool.query(query, [personalData], (err, rows, fields) => {
        if (!err) {
          res.json({ status: true, message: "Datos insertados", ok: true });
        } else {
          console.log(err);
          res.json({
            status: false,
            message: "no se pudo insertar los datos, corrija los campos",
            ok: false,
          });
        }
      });
  } catch (error) {
    res.json({
      status: false,
      message: "nose pudo registrar al personal",
      ok: false,
    });
  }
};

//======================================================================================================================

exports.update = async (req, res) => {
  try {
    const {
      nombre,
      paterno,
      genero,
      materno,
      dni,
      url,
      telefono,
      direccion,
      fecha_nacimiento,
      correo,
      idTipoPersonal,
    } = req.body;
    const { id } = req.params;
    const personalVerufy = await verifyPersonal(dni, correo);
    if (personalVerufy.length <= 0) {
      res.json({ status: false, message: "el personal no existe", ok: false });
      return;
    }
    const personalData = {
      PER_nombre: nombre,
      PER_apaterno: paterno,
      PER_amaterno: materno,
      PER_genero: genero,
      PER_fec_nacimiento: fecha_nacimiento,
      PER_foto: url,
      PER_telefono: telefono,
      PER_dni: dni,
      PER_correo: correo,
      PER_direccion: direccion,
      TTR_id: idTipoPersonal,
    };

    const query = "update personal set ? where PER_id = ?";
    await pool.query(query, [personalData, id], (err, rows, fields) => {
      if (!err) {
        res.json({ status: true, message: "Datos actualizados", ok: true });
      } else {
        console.error("error update", fecha_nacimiento,err);
        res.json({
          status: false,
          message: "nose pudo actualizar los dtaos corrija los campos",
          ok: false,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: false,
      message: "nose pudo actualizar los dtaos corrija los campos 2",
      ok: false,
    });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  //verificar si existe el id
  //el status= true ==1 es que si existe y el false==0 es que no existe
  try {
    const query = "update personal set PER_estado=0 where PER_id=?";
    await pool.query(query, [id], (err, rows, fields) => {
      if (!err) {
        res.json({ status: true, message: "personal eliminado", ok: true });
      } else {
        console.log(err);
        res.json({
          status: false,
          message: "nose pudo eliminar al personal",
          ok: false,
        });
      }
    });
  } catch (error) {
    res.json({
      status: false,
      message: "nose pudo eliminar al personal",
      ok: false,
    });
  }
};
const verifyPersonal = async (dni, correo) => {
  const query = "select * from personal where PER_dni=? or PER_correo=?";
  const [rows] = await pool.query(query, [dni, correo]);
  return rows;
};

exports.updatePassword = async (req, res) => {
  try {
    const { dni } = req.params;
    const { password, token } = req.body;
    if(token !== 'iokjdwqesaiojkdsfackolijdsfcklijdcfskljidsfcakjildsackljsdaccdsijo'){
        res.json({ status: false, message: "token incorrecto", ok: false });
        return;
    }
  const query = "update personal set PER_contrasena=? where PER_dni=?";
  await pool.query(query, [password, dni], (err, rows, fields) => {
    if (!err) {
      res.json({ status: true, message: "contraseña actualizada", ok: true });
    } else {
      console.log(err);
      res.json({
        status: false,
        message: "nose pudo actualizar la contraseña",
        ok: false,
      });
    }
  });
  } catch (error) {
    res.json({
      status: false,
      message: "nose pudo actualizar la contraseña",
      ok: false,
    });
  }
};
