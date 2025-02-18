require('dotenv').config();
const mysql = require('mysql2');
const { promisify } = require('util');
const connectionString = process.env.BD_URL_CONNECTION || '';
const dbUrl = new URL(connectionString);

const database = {
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  port: dbUrl.port,
  connectTimeout: process.env.DB_CONNECTION_TIMEOUT || 10000, // Aumentar el tiempo de espera de la conexión
};

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) connection.release()
    console.log('DB is connected 1');
    return
});

//promisefy pool query
pool.query = promisify(pool.query);

module.exports = pool;


// const mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'control_personal',
//     multipleStatements: true
// });

// mysqlConnection.connect(function (err) {
//     if (err) {
//         console.log(err);
//         return;
//     }else {
//         console.log('DB is connected');
//     }
// });