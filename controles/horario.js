const pool = require('../src/database');

exports.list = async (req, res) => 
{

    const query = 'select HOR_id as id, HOR_detalle as detalle, HOR_entrada as entrada, HOR_salida as salida, HOR_receso_inn as inicioReceso, HOR_receso_out as finReceso, HOR_estado as estado from horario';
    await pool.query(query, [],(err, rows, fields) => {
        if (!err) {
            res.json({
                ok: true,
                data: rows,
                message: "",
            });
        } else {
            console.error(err);
            res.json({
                ok: false,
                data: [],
                message: "no se encontro al personal",
            });
        }
    });

}

exports.listContrato2 = async (req, res) => 
{

    const query = 'CALL SP_CRUD_HORARIO (?,null,null,null,null,null,null,null,null)';
    await pool.query(query,'S' ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}

exports.listId = async (req, res) => 
{
    const {id} = req.params;
    const query = 'select HOR_id as id, HOR_detalle as detalle, HOR_dirigido as dirigido, HOR_entrada as entrada, HOR_salida as salida, HOR_receso_inn as inicioReceso, HOR_receso_out as finReceso, HOR_estado as estado from horario where HOR_id = ?';
    await pool.query(query,id ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}
//======================================================================================================================
exports.insert = async (req, res) => 
{
    const {detalle,entrada,salida,inicioReceso,finReceso} = req.body;
    const query = 'insert into horario (HOR_detalle,HOR_entrada,HOR_salida,HOR_receso_inn,HOR_receso_out) values (?,?,?,?,?)';
    const formatEntrada = entrada.split(' ')[0];
    const formatSalida = salida.split(' ')[0];
    const formatInicioReceso = inicioReceso.split(' ')[0];
    const formatFinReceso = finReceso.split(' ')[0];
    await pool.query(query,[detalle,formatEntrada,formatSalida,formatInicioReceso,formatFinReceso],(err, rows, fields) => {
        if (!err) {
            res.json({status:true,message:'Horario registrado correctamente'});
        } else {
            console.log(err);
            res.json({status:false,message:'Error al registrar el horario'});
        }
    });
      
};

//======================================================================================================================

exports.update = async (req, res) => 
{

    const {detalle,entrada,salida,inicioReceso,finReceso,dirigido,estado} = req.body;
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_HORARIOID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del horario no existe'});
                
            }else{
                const query = `CALL SP_CRUD_HORARIO (?,?,?,?,?,?,?,?,?)`;
                pool.query(query,['M',id,detalle,entrada,salida, inicioReceso,finReceso,dirigido,estado],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'Horario modificado correctamente'});
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            console.log(err);
        }   
    });    
};

exports.delete = async (req, res) => 
{
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_HORARIOID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del horario no existe'});
                
            }else{
                const query = `CALL SP_CRUD_HORARIO (?,?,?,?,?,?,?,?,?)`;
                pool.query(query,['D',id,null,null,null, null,null,null,null],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'Horario eliminado'});
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            console.log(err);
        }   
    });
    
};