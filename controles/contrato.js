const { send } = require('express/lib/response');
const pool = require('../src/database');

//list of personal
exports.list = (req, res) => 
{

    const query = `CALL SP_CRUD_CONTRATO (?,?,?,?,?,?,?)`;
    const prueba = pool.query(query, ['S',null,null,null,null,null,null], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}

exports.list3 = (req, res) => 
{

    const query = `SELECT *
    FROM contrato INNER JOIN
          personal ON contrato.PER_id = personal.PER_id INNER JOIN
          tipo_trabajador ON contrato.TTR_id = tipo_trabajador.TTR_id
          order by contrato.CON_id;`;
    const prueba = pool.query(query, [], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}

exports.horarios = (req, res) => 
{
    const {id} = req.params;

    const query = `select HOR_id from contrato_horario where CON_id=?`;
    const prueba = pool.query(query, [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}

exports.id = (req, res) => 
{
    const {id} = req.params;
    const query = `select * from contrato where PER_id=FUC_ID_PERSONAL(?)`;
    pool.query(query, [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}

exports.validateDate = async(req, res) => 
{
    const {dni}=req.params;

    try {
        console.log(dni);
        const query = `select PER_id from personal where PER_dni=?`;
        const query2 = `select CON_fecha_out from contrato where PER_id=? order by CON_fecha_out desc `;
        const prueba =await pool.query(query, dni);
        const prueba2 =await pool.query(query2, [prueba[0].PER_id]);
        await res.json(prueba2[0]);
        
    } catch (error) {
        console.log(error);
    }

}

//======================================================================================================================
exports.insert = async (req, res) => 
{

    const {fechaInicioContrato,dni,fechaFinContrato,idPersonal,idTipoTrabajador,idHorarios} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe

    const query = `CALL SP_CRUD_CONTRATO (?,?,?,?,?,FUC_ID_PERSONAL(?),?)`;
    const query2 = `CALL SP_CRUD_JORNADA_LABORAL (?,?,FUC_ID_CONTRATO(FUC_ID_PERSONAL(?)),?,?,?,?,?,?)`;
    pool.query(query, ['A',null,fechaInicioContrato,fechaFinContrato,null,dni,idTipoTrabajador], async(err, rows, fields) => {
        if (!err) {
            // jornada laboral
            pool.query(query2, ['A',null,dni,null,null,null,fechaInicioContrato,fechaFinContrato,null],(err, rows, fields) => {
                if (!err) {
                    console.log("se inserto el jornada");
                } else {
                    console.log(err);
                }
            } );
            
            let valor= idHorarios.length;
            console.log(valor);
            for(let a=0 ;a<valor;a++){
                const query3 = `CALL SP_CRUD_CONTRATO_HORARIO (?,FUC_ID_CONTRATO(FUC_ID_PERSONAL(?)),?)`;
                pool.query(query3, ['A',dni,idHorarios[a]],(err, rows, fields) => {
                    if (!err) {
                        console.log("se inserto la horario");
                    } else {
                        console.log(err);
                    }
                } );
            };
            res.json({status:false,message:'contrato y jornada laboral registrado'});
        } else {
            res.json({status:false,message:'personal no existe'});
        }
    });
            

    

    //traer el id por defecto de pedido para insertar en la tabla detalle


       
};

//======================================================================================================================

exports.update = async (req, res) => 
{
    const {fechaInicioContrato,dni,fechaFinContrato,idTipoTrabajador,estado,idHorarios} = req.body;
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe

    const query = `CALL SP_CRUD_CONTRATO (?,?,?,?,?,FUC_ID_PERSONAL(?),?)`;
    const query2 = `CALL SP_CRUD_JORNADA_LABORAL (?,?,FUC_ID_CONTRATO(FUC_ID_PERSONAL(?)),?,?,?,?,?,?)`;
    const query3 = `select FUC_VERIFICAR_CONTRATO_JORNADALABORAL(?,?) as valor2`;
                                        
    pool.query(query3, [id,fechaInicioContrato],(err, rows, fields) => {
        if (!err) {
            
            if(rows[0]['valor2']===1){
                console.log("aca entro");
                pool.query(query, ['M',id,fechaInicioContrato,fechaFinContrato,'1',dni,idTipoTrabajador],async(err, rows, fields) => {
                    if(!err){
                        pool.query(query2, ['A',null,dni,null,null,null,fechaInicioContrato,fechaFinContrato,null],(err, rows, fields) => {
                            if (!err) {
                                console.log('el contrato y la jornada laboral fueron actualizados');
                            } else {
                                console.log(err);
                            }
                        } );
                        await pool.query(`CALL SP_CRUD_CONTRATO_HORARIO (?,?,?)`,['D',id,null]);
                        let valor= idHorarios.length;
                        for(let a=0 ;a<valor;a++){
                            const query4 = `CALL SP_CRUD_CONTRATO_HORARIO (?,FUC_ID_CONTRATO(FUC_ID_PERSONAL(?)),?)`;
                            pool.query(query4, ['A',dni,idHorarios[a]],(err, rows, fields) => {
                                if (!err) {
                                    console.log("se inserto la horario");
                                } else {
                                    console.log(err);
                                }
                            } );
                        };
                        res.json({status:false,message:'contrato y jornada laboral acatualizado'});
                    }
                });
                
                
            }else{
                pool.query(query, ['P',id,fechaInicioContrato,fechaFinContrato,'1',dni,idTipoTrabajador],async(err, rows, fields) => {
                    if(!err){
                        await pool.query(`CALL SP_CRUD_CONTRATO_HORARIO (?,?,?)`,['D',id,null]);
                        let valor= idHorarios.length;
                        for(let a=0 ;a<valor;a++){
                            const query4 = `CALL SP_CRUD_CONTRATO_HORARIO (?,FUC_ID_CONTRATO(FUC_ID_PERSONAL(?)),?)`;
                            pool.query(query4, ['A',dni,idHorarios[a]],(err, rows, fields) => {
                                if (!err) {
                                    console.log("se inserto la horario");
                                } else {
                                    console.log(err);
                                }
                            } );
                        };
                        res.json({status:false,message:'solo se modifico el cargo y el horario pero no se puede alterar las fechas y la jornada laboral'});
                            }
                        });             
            }
        } else {
            console.log(err);
            res.json({status:false,message:'existe movimiento o no hay cambios en las fechas'});
        }
    } );

};   


//======================================================================================================================
exports.delete = (req, res) => 
{
    const {id} = req.params;
    const {opcion, fecha} = req.body;
    //opcion T es para terminar el contrato y D es para eliminarlo
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    //opcion T es cerrar el contrato y D es eliminarlo
    pool.query(`select FUC_VERIFICAR_CONTRATOID_EXISTENTE(?) as valor`,id,(err, rows, fields) => {
        if (!err) {
            if(rows[0]['valor']===0){
                res.json({status:true,message:'el id del personal no existe'});
                
            }else{
                const query = `call SP_TERMINAR_ELIMINAR_CONTRATO(?, ?, ?)`;
                pool.query(query, [opcion,id,fecha],(err, rows, fields) => {
                        if (!err) {
                            opcion === "D" ? res.json({status:true,message:'contrato eliminado'}) :
                            res.json({status:true,message:'contrato terminado'});
                        } else {
                            console.log(err);
                            res.json({status:false,message:'contrato no fue eliminado hubo un error'});
                        }
                    });
            }
        } else {
            console.log(err);
        }   
    });
    
};