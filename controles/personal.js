const pool = require('../src/database');

exports.list = async (req, res) => 
{
    const fecha= new Date();
    console.log(fecha);
    const query = `SELECT PER_id as id,PER_dni as dni,PER_nombre as nombre,PER_apaterno 
    as apellidoPaterno,PER_amaterno as apellidoMaterno,PER_genero 
    as sexo,PER_fec_nacimiento as fechaNacimiento, PER_foto as "foto",
     PER_estado as estado , PER_direccion as direccion, PER_telefono as 
    telefono, TIMESTAMPDIFF(Year,PER_fec_nacimiento ,?) as edad FROM PERSONAL;`;
    await pool.query(query,fecha,(err, rows, fields) => {
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
    const query = 'CALL SP_CRUD_PERSONAL (?,?,null,null,null,null,null,null,null,null,null,null)';
    await pool.query(query,['I',id] ,(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });

}

exports.id = async (req, res) => 
{
    const {dni}=req.body;
    const query = 'select * from personal where PER_dni=?';
    await pool.query(query,[dni] ,(err, rows, fields) => {
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

    const {id,nombre,paterno,genero,materno,dni,url,telefono,direccion,fecha_nacimiento,estado,idHuellas} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe
    await pool.query(`select verificaciones(?,?,?) as valor`,["dni",null,dni],(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===1){
                res.json({status:true,message:'El personal ya existe'});
                
            }else{
                const query = `CALL SP_CRUD_PERSONAL(?,?,?,?,?,?,?,?,?,?,?,?);`;
                pool.query(query, ['A',id,nombre,paterno,materno,genero,fecha_nacimiento,url,estado,telefono, dni, direccion],(err, rows, fields) => {
                    if (!err) {
                        for(let f =0; f<idHuellas;f++){
                            pool.query(`insert into huella (PER_id) values(FUC_ID_PERSONAL(?))`, [dni],(err, rows, fields));
                        }
                        res.json({status:false,message:'Personal y huella registrado'});
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