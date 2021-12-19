const pool = require('../src/database');

exports.list = (req, res) => 
{
    const {fecha}=req.body;
    console.log(fecha);
    const query = `
    SELECT contrato.CON_id, personal.PER_nombre, personal.PER_apaterno, tipo_trabajador.TTR_cargo, registro_entrada.REGE_hora_inn,
jornada_laboral.JLAB_asistencia, FUC_VERIFICAR_HORAS_TRABAJADAS(contrato.CON_id,?) as 'htrabajadas',FUC_VERIFICAR_HORAS_DEUDA(contrato.CON_id,?)
as 'hdeuda'
FROM     contrato INNER JOIN
                  personal ON contrato.PER_id = personal.PER_id INNER JOIN
                  tipo_trabajador ON contrato.TTR_id = tipo_trabajador.TTR_id INNER JOIN
                  registro_entrada ON contrato.CON_id = registro_entrada.CON_id INNER JOIN
                  jornada_laboral ON contrato.CON_id = jornada_laboral.CON_id AND registro_entrada.JLAB_id = jornada_laboral.JLAB_id AND 
                  registro_entrada.CON_id = jornada_laboral.CON_id where jornada_laboral.JLAB_fecha=? group by contrato.CON_id`;
    const prueba = pool.query(query, [fecha,fecha,fecha], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}