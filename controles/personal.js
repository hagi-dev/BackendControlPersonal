const pool = require('../src/database');

exports.list = async (req, res) => 
{

    const query = 'CALL SP_CRUD_PERSONAL (?,null,null,null,null,null,null,null,null,null,null,null)';
    await pool.query(query,'S' ,(err, rows, fields) => {
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

    const {id,nombre,paterno,genero,materno,dni,url,telefono,direccion,fecha_nacimiento,estado} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_PERSONAL_EXISTENTE(?) as valor`,dni,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===1){
                res.json({status:true,message:'El personal ya existe'});
                
            }else{
                const query = `CALL SP_CRUD_PERSONAL(?,?,?,?,?,?,?,?,?,?,?,?);`;
                pool.query(query, ['A',id,nombre,paterno,materno,genero,fecha_nacimiento,url,estado,telefono, dni, direccion],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:false,message:'Personal registrado'});
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

    const {nombre,paterno,genero,materno,dni,url,telefono,direccion,fecha_nacimiento,estado} = req.body;
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select FUC_VERIFICAR_PERSONALID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del personal no existe'});
                
            }else{
                const query = `CALL SP_CRUD_PERSONAL(?,?,?,?,?,?,?,?,?,?,?,?);`;
                pool.query(query, ['M',id,nombre,paterno,materno,genero,fecha_nacimiento,url,estado,telefono, dni, direccion],(err, rows, fields) => {
                    if (!err) {
                        res.json({status:true,message:'Datos actualizados'});
                    } else {
                        console.log(err);
                        res.json({status:false,message:'nose pudo actualizar los dtaos corrija los campos'});
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
    await pool.query(`select FUC_VERIFICAR_PERSONALID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del personal no existe'});
                
            }else{
                const query = `CALL SP_CRUD_PERSONAL(?,?,?,?,?,?,?,?,?,?,?,?);`;
                pool.query(query, ['D',id,null,null,null,null,null,null,null,null, null, null],(err, rows, fields) => {
                     if (!err) {
                         res.json({status:true,message:'personal eliminado'});
                     } else {
                         console.log(err);
                         res.json({status:false,message:'personal no fue eliminado hubo un error'});
                     }
                 });
            }
        } else {
            console.log(err);
        }   
    });
    
};