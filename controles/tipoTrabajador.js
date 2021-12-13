const pool = require('../src/database');

exports.list = async (req, res) => 
{

    const query = 'CALL SP_CRUD_TIPO_TRABAJADOR (?,null,null,null,null)';
    await pool.query(query,'CC' ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}

exports.listContratoArea = async (req, res) => 
{

    const query = 'select TTR_area as area, TTR_id as id from tipo_trabajador group by TTR_area';
    await pool.query(query,'CC' ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}

exports.listContratoCargo = async (req, res) => 
{

    const query = 'select TTR_cargo as cargo, TTR_id as id, TTR_area as area from tipo_trabajador';
    await pool.query(query,'CC' ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}

exports.listId = async (req, res) =>
{
    const { id } = req.params;
    const query = "select TTR_area as 'area', TTR_cargo as 'cargo' from tipo_trabajador where TTR_id = ?";
    await pool.query(query, [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);}
    });
}
//======================================================================================================================
exports.insert = async (req, res) => 
{
    const {cargo,area} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_TIPOTRABAJADOR_EXISTENTE(?,?) as valor`,[area,cargo],(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===1){
                res.json({status:true,message:'el cargo ya existe'});
                
            }else{
                const query = `CALL SP_CRUD_TIPO_TRABAJADOR (?,?,?,?,?)`;
                pool.query(query,['A',null,cargo,area,null],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'cargo registrado'});
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

    const {cargo,area,estado} = req.body;
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_TIPOTRABAJADORID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        console.log(rows[0]['valor']);
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:false,message:'el id del cargo no existe'});
                
            }else{
                const query = `CALL SP_CRUD_TIPO_TRABAJADOR (?,?,?,?,?)`;
                pool.query(query,['M',id,cargo,area,estado],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:true,message:'cargo modificado correctamente'});
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
    await pool.query(`select FUC_VERIFICAR_TIPOTRABAJADORID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del cargo no existe'});
                
            }else{
                const query = `CALL SP_CRUD_TIPO_TRABAJADOR (?,?,?,?,?)`;
                pool.query(query,['D',id,null,null,null],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'cargo eliminado'});
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