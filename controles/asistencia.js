const pool = require("../src/database");

exports.list = async (req, res) => {
  const { fecha } = req.body;
  console.log(fecha);
  const query = `SELECT *
    FROM asistencia a
    JOIN contrato c ON c.CON_id = a.CON_id
    JOIN personal p ON c.PER_id = p.PER_id
    JOIN tipo_trabajador t ON p.TTR_id = t.TTR_id
    WHERE a.ASI_fecha = ?;`;
  await pool.query(query, [fecha], (err, rows, fields) => {
    if (!err) {
      res.json({
        status: true,
        rows: rows.map((row) => {
          return {
            contratoId: row.CON_id,
            asistenciaId: row.ASI_id,
            nombre: `${row.PER_nombre} ${row.PER_apaterno} ${row.PER_amaterno}`,
            dni: row.PER_dni,
            cargo: row.TTR_descripcion,
            observacion: row.ASI_comentarios,
            fecha: row.ASI_fecha,
            horaEntrada: row.ASI_hora_ingreso,
            horaSalida: row.ASI_hora_salida,
            personalId: row.PER_id,
            horasTrabajadas: row.ASI_horas_trabajadas,
            horasDebidas: row.ASI_horas_debidas,
            horasExtras: row.ASI_horas_extra,
            verificacion: row.ASI_verification,
          };
        }),
        message: "",
      });
    } else {
      console.log(err);
      res.json({ status: false, message: "error en la consulta" });
    }
  });
};

exports.PersonalAsistenciaWithMes = async (req, res) => {
  const { moth, year, personalId } = req.params;
  const query = `SELECT *
    FROM asistencia a
    JOIN contrato c ON c.CON_id = a.CON_id
    JOIN personal p ON c.PER_id = p.PER_id
    JOIN tipo_trabajador t ON p.TTR_id = t.TTR_id
    WHERE MONTH(a.ASI_fecha) = ? AND YEAR(a.ASI_fecha) = ? AND p.PER_id = ?;`;
  await pool.query(query, [moth, year, personalId], (err, rows, fields) => {
    if (!err) {
      res.json({
        status: true,
        horas: {
          horasTrabajadasMes: `${rows.reduce((acc, row) => acc + Number(row.ASI_horas_trabajadas), 0).toFixed(2)} horas`,
          horasDebidasMes: `${rows.reduce((acc, row) => acc + Number(row.ASI_horas_debidas), 0).toFixed(2)} horas`,
          horasExtrasMes: `${rows.reduce((acc, row) => acc + Number(row.ASI_horas_extra), 0).toFixed(2)} horas`,
        },
        message: "",
      });
    } else {
      console.log(err);
      res.json({ status: false, message: "error en la consulta" });
    }
  });
}
