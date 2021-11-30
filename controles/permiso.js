const pool = require('../src/database');

exports.list = async (req, res) => 
{

    const query = 'CALL SP_CRUD_PERMISO (?,null,null,null,null,null,null,null)';
    pool.query(query,'S' ,(err, rows, fields) => {
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
    const {detalle,fechaInicio,idContrato,fechaFinal} = req.body;
    //verificar si existe el personal
    //el status= true ==1 es que si existe y el false==0 es que no existe
    // la asistencia se divide en 4 partes que es 0= no asistio, 1= asistio, 2= feriado, 3= permiso
    try {
        const existe = await pool.query(`select FUC_VERIFICAR_PERMISO_EXISTENTE(?,?,?,?) as valor`,[detalle,fechaInicio,fechaFinal,idContrato]);
        await pool.query(`call SP_CRUD_PERMISO(?,?,?,?,?,?,?,?)`,['A',null,detalle,fechaInicio,null,idContrato,fechaFinal,existe[0]['valor']]);
        await pool.query(`call SP_CRUD_JORNADA_LABORAL(?,?,?,?,?,?,?,?,?)`,['MP',null,idContrato,null,null,'3',fechaInicio,fechaFinal,existe[0]['valor']]);
        res.json({status:false,message: existe[0]['valor']===0?'Permiso registrado correctamente':'el permiso ya existe'});
        console.log(existe[0]['valor']);
    }catch (e) {
        console.log(e);
        res.json({status:true,message:`error el proceso de resgistrar permiso falta datos ${e}`});
    } 
};

//======================================================================================================================

exports.update = async (req, res) => 
{

    const {detalle,fechaInicio,idContrato,fechaFinal,estado} = req.body;
    const {id} = req.params;
    //verificar si existe el id
    //el status= true ==1 es que si existe y el false==0 es que no existe
    try {
        await pool.query(`call SP_CRUD_PERMISO(?,?,?,?,?,?,?,?)`,['M',id,detalle,fechaInicio,estado,idContrato,fechaFinal,null]);
        await pool.query(`call SP_CRUD_JORNADA_LABORAL(?,?,?,?,?,?,?,?,?)`,['MP',id,idContrato,null,null,'3',fechaInicio,fechaFinal,2]);
        res.json({status:false,message: 'Permiso actualizado correctamente'});
        console.log(existe[0]['valor']);
    }catch (e) {
        console.log(e);
        res.json({status:true,message:`error el proceso de actualizar permiso falta datos ${e}`});
    }     
};

exports.delete = async (req, res) => 
{
    const {id} = req.params;
    /**
    verificar si existe el id
    el status= true ==1 es que si existe y el false==0 es que no exist
    **/
                
    try {
        
        const query = `CALL SP_CRUD_PERMISO (?,?,?,?,?,?,?,?)`;
        const query2 = `Select FUC_VERIFICAR_FECHA_PERMISO(?) as valor`;
        const valor = await pool.query(query2,[id]).catch(e=>console.log(`hubo un error en verficar la fecha del permiso: ${e}`));
        await pool.query(query,['D',id,null,null,null, null,null,valor],(err, rows, fields) => {
            if (!err) {
                res.json({status:false,message:'Permiso eliminado'});
            } else {
                console.log(err);
            }
        });

    } catch (error) {
        
    }

    
};