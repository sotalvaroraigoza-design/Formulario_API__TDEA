const { Sequelize } = require('sequelize');


const DB_TYPE = process.env.DB_TYPE || 'mysql';


const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'demo';

let sequelize;

if (DB_TYPE === 'mysql') {
    sequelize = new Sequelize(
        DB_NAME,
        process.env.DB_USER || 'generico',
        process.env.DB_PASSWORD || 'geenerico',
        {
            host: DB_HOST,
            port: process.env.DB_PORT || 3306,
            dialect: 'mysql',
            logging: false
        }
    );
}

if (DB_TYPE === 'mssql') {
    sequelize = new Sequelize(
        DB_NAME,
        process.env.DB_USER || 'genericooo',
        process.env.DB_PASSWORD || 'genericoooo',
        {
            host: DB_HOST,
            port: Number(process.env.DB_PORT) || 1433,
            dialect: 'mssql',
            logging: false,
            dialectOptions: {
                options: {
                    encrypt: false,
                    trustServerCertificate: true
                }
            }
        }
    );
}

if (!sequelize) {
    throw new Error(`DB_TYPE no válido: "${DB_TYPE}". Usa "mysql" o "mssql".`);
}

module.exports = sequelize;