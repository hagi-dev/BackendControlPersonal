const pool = require('../src/database');

exports.list = (req, res) => 
{
    const {fecha}=req.body;
    console.log(fecha);
    const query = `CALL SP_CRUD_ASISTENCIA (?,?,?)`;
    const prueba = pool.query(query, ['S',null,fecha], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}