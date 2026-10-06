const db = require('../config/db');

const COLUMNAS = `
    id,
    tipo_documento   AS tipoDocumento,
    numero_documento AS numeroDocumento,
    nombres,
    apellidos,
    direccion,
    ciudad,
    fecha_nacimiento AS fechaNacimiento,
    correo
`;

exports.getAll = (callback) => {
    db.query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id`, callback);
};

exports.getById = (id, callback) => {
    db.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = ?`, [id], callback);
};

exports.create = (usuario, callback) => {
    db.query(
        `INSERT INTO usuarios
            (tipo_documento, numero_documento, nombres, apellidos, direccion, ciudad, fecha_nacimiento, correo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario.tipoDocumento,
            usuario.numeroDocumento,
            usuario.nombres,
            usuario.apellidos,
            usuario.direccion,
            usuario.ciudad,
            usuario.fechaNacimiento,
            usuario.correo
        ],
        callback
    );
};

exports.update = (id, usuario, callback) => {
    db.query(
        `UPDATE usuarios SET
            tipo_documento=?, numero_documento=?, nombres=?, apellidos=?,
            direccion=?, ciudad=?, fecha_nacimiento=?, correo=?
         WHERE id=?`,
        [
            usuario.tipoDocumento,
            usuario.numeroDocumento,
            usuario.nombres,
            usuario.apellidos,
            usuario.direccion,
            usuario.ciudad,
            usuario.fechaNacimiento,
            usuario.correo,
            id
        ],
        callback
    );
};

exports.delete = (id, callback) => {
    db.query('DELETE FROM usuarios WHERE id=?', [id], callback);
};
