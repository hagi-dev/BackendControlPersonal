const pool = require('../src/database');

exports.list = async (req, res) => 
{

    const query = 'SELECT * FROM asistencia';
    await pool.query(query,'S' ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}