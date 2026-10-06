const mysql = require('mysql2');


const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'demo',
    dateStrings: true
});
// Prueba de conexión al arrancar
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error de conexión:', err.message);
    } else {
        console.log('Conectado a MySQL');
        conn.release();
    }
});

module.exports = connection;
