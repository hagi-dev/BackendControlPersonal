const pool = require('../src/database');

exports.list = async (req, res) => 
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
    const query = 'select HOR_detalle as detalle, HOR_dirigido as dirigido, HOR_entrada as entrada, HOR_salida as salida, HOR_receso_inn as inicioReceso, HOR_receso_out as finReceso, HOR_estado as estado from horario where HOR_id = ?';
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
    const {detalle,entrada,salida,inicioReceso,finReceso,dirigido} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_HORARIO_EXISTENTE(?,?,?,?,?,?) as valor`,[detalle,dirigido,entrada,salida,inicioReceso, finReceso],(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===1){
                res.json({status:true,message:'el horario ya existe'});
                console.log(rows[0]['valor']);
            }else{
                const query = `CALL SP_CRUD_HORARIO (?,?,?,?,?,?,?,?,?)`;
                pool.query(query,['A',null,detalle,entrada,salida, inicioReceso,finReceso,dirigido,null],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'Horario registrado'});
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