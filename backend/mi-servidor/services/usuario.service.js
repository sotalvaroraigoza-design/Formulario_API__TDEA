const usuarioModel = require('../models/usuario.model');

const CAMPOS_OBLIGATORIOS = [
    'tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos',
    'direccion', 'ciudad', 'fechaNacimiento', 'correo'
];

// Lógica de negocio: valida los datos y deja solo los campos que la BD necesita
function validarYLimpiar(usuario) {
    const datos = usuario || {};
    const faltantes = CAMPOS_OBLIGATORIOS.filter(
        (campo) => typeof datos[campo] !== 'string' || datos[campo].trim() === ''
    );

    if (faltantes.length > 0) {
        const error = new Error(`Faltan campos obligatorios: ${faltantes.join(', ')}`);
        error.status = 400;
        return { error };
    }

    if (!/^\S+@\S+\.\S+$/.test(datos.correo.trim())) {
        const error = new Error('El correo electrónico no es válido');
        error.status = 400;
        return { error };
    }

    const limpio = {};
    CAMPOS_OBLIGATORIOS.forEach((campo) => {
        limpio[campo] = datos[campo].trim();
    });
    return { limpio };
}

exports.getAll = (cb) => usuarioModel.getAll(cb);

exports.getById = (id, cb) => usuarioModel.getById(id, cb);

exports.create = (usuario, cb) => {
    const { error, limpio } = validarYLimpiar(usuario);
    if (error) return cb(error);
    usuarioModel.create(limpio, (err, result) => cb(err, result, limpio));
};

exports.update = (id, usuario, cb) => {
    const { error, limpio } = validarYLimpiar(usuario);
    if (error) return cb(error);
    usuarioModel.update(id, limpio, cb);
};

exports.delete = (id, cb) => usuarioModel.delete(id, cb);
