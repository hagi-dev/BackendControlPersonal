require('dotenv').config();
const mysql = require('mysql2/promise');
const { promisify } = require('util');
const { URL } = require('url');

// Parsear la cadena de conexión
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

pool.getConnection()
  .then(connection => {
    console.log('DB is connected');
    connection.release();
  })
  .catch(err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    if (err.code === 'ETIMEDOUT') {
      console.error('Database connection timed out.');
    }
    console.error('Error connecting to the database:', err);
  });

// Promisify pool query
pool.query = promisify(pool.query);

module.exports = pool;