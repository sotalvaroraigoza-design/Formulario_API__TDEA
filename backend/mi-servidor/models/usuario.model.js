const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipoDocumento: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'tipo_documento'
    },
    numeroDocumento: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'numero_documento'
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY, // llega y sale como 'YYYY-MM-DD'
        allowNull: false,
        field: 'fecha_nacimiento'
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
        // el mismo tipo + número de documento no se puede repetir
        { name: 'uq_documento', unique: true, fields: ['tipo_documento', 'numero_documento'] }
    ]
});

module.exports = Usuario;

