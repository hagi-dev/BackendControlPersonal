const SerialPort = require('serialport');
const { Socket } = require('socket.io');
const Readline = SerialPort.parsers.Readline;
const SocketIO = require('socket.io');
const pool = require('../src/database');

const port = new SerialPort('COM6', {
    baudRate: 57600
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('open', () => {
    console.log('connection is opened');
});
4
//fuction subString date
const formatearFecha = (fecha) => {
    let fecha1= new Date(fecha);
    let dia = fecha1.getDate();
    let mes = fecha1.getMonth() + 1;
    let anio = fecha1.getFullYear();
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    return anio + '-' + mes + '-' + dia;
}

parser.on('data', async (data) => {
    try {
        console.log('entrando');
        if(!(data==="Clave Correcta")){
            console.log('entrando al if');
            let hoy=new Date();
            // extraer solo la fecha de Date
            const date1 = formatearFecha(hoy);
            // extraer solo la hora de Date para
            const time1 = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
            await console.log(time1);
            await console.log(date1);
            let id= parseInt(data); 
            const personaid =await pool.query(`select PER_id from huella where HUE_id=?`,id);
            await console.log(personaid[0].PER_id);
            const contratoid=await pool.query(`select CON_id FROM contrato WHERE PER_id=? and (? >=CON_fecha_inn and ?<= CON_fecha_out)`,[personaid[0]['PER_id'],date1,date1]);
            await console.log("este es id contrato");
            await console.log(contratoid[0].CON_id);
            const jornadaid=await pool.query(`select JLAB_id FROM jornada_laboral WHERE JLAB_fecha=? and CON_id=?`,[date1,contratoid[0]['CON_id']]);
            await console.log(jornadaid[0].JLAB_id);
            const verificar= await pool.query(`select FUC_VERIFICAR_HORARIO(?,?,?) as valor`,[contratoid[0].CON_id,date1,time1]);
            console.log(verificar[0].valor);
            switch(verificar[0].valor){
                case 10:
                    await pool.query(`insert into registro_entrada (JLAB_id,CON_id,REGE_hora_inn,REGE_justificacion) values (?,?,?,?)`,[jornadaid[0]['JLAB_id'],contratoid[0]['CON_id'],time1,'3']);
                    await pool.query(`update jornada_laboral set JLAB_asistencia=?, JLAB_observacion=? where JLAB_id=?`,['1',"asistio",jornadaid[0]['JLAB_id']]);
                    break;
                case 20:
                    await pool.query(`insert into registro_entrada (JLAB_id,CON_id,REGE_hora_inn,REGE_justificacion) values (?,?,?,?)`,[jornadaid[0]['JLAB_id'],contratoid[0]['CON_id'],time1,'0']);
                    await pool.query(`update jornada_laboral set JLAB_asistencia=?, JLAB_observacion=? where JLAB_id=?`,['1',"llego tarde",jornadaid[0]['JLAB_id']]);
                    break;
                case 30:
                    await pool.query(`insert into registro_entrada (JLAB_id,CON_id,REGE_hora_inn,REGE_justificacion) values (?,?,?,?)`,[jornadaid[0]['JLAB_id'],contratoid[0]['CON_id'],time1,'0']);
                    await pool.query(`update jornada_laboral set JLAB_asistencia=?, JLAB_observacion=? where JLAB_id=?`,['1',"salio muy temprano",jornadaid[0]['JLAB_id']]);
                    break; 
                default: console.log('no se pudo registrar');break;       
            }
            console.log("asitencia registrada");  
        }else{console.log("salio else");}
    }catch (e) {
        console.log(`error al ingresar asitenci ${e}`);
    } 
    console.log(data);
});

port.on('error', (err) => {
    console.log('Error: ', err.message);
});

//Access is denied COM6
//connection is opened
//Error:  Access is denied COM6
//Err