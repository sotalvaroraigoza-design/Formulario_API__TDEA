const Usuario = require('../models/usuario.model');

const CAMPOS_OBLIGATORIOS = [
    'tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos',
    'direccion', 'ciudad', 'fechaNacimiento', 'correo'
];

// Lógica de negocio: valida los datos y deja solo los campos que el modelo necesita
function validarYLimpiar(usuario) {
    const datos = usuario || {};
    const faltantes = CAMPOS_OBLIGATORIOS.filter(
        (campo) => typeof datos[campo] !== 'string' || datos[campo].trim() === ''
    );

    if (faltantes.length > 0) {
        const error = new Error(`Faltan campos obligatorios: ${faltantes.join(', ')}`);
        error.status = 400;
        throw error;
    }

    if (!/^\S+@\S+\.\S+$/.test(datos.correo.trim())) {
        const error = new Error('El correo electrónico no es válido');
        error.status = 400;
        throw error;
    }

    const limpio = {};
    CAMPOS_OBLIGATORIOS.forEach((campo) => {
        limpio[campo] = datos[campo].trim();
    });
    return limpio;
}

// Todos los métodos devuelven una Promesa (se usan con async/await)

exports.getAll = () => Usuario.findAll({ order: [['id', 'ASC']] });

exports.getById = (id) => Usuario.findByPk(id);

exports.create = async (usuario) => {
    const datos = validarYLimpiar(usuario);
    return Usuario.create(datos);
};

// devuelve el usuario actualizado, o null si el id no existe
exports.update = async (id, usuario) => {
    const datos = validarYLimpiar(usuario);
    const existente = await Usuario.findByPk(id);
    if (!existente) return null;
    return existente.update(datos);
};

// devuelve true si lo eliminó, o false si el id no existe
exports.delete = async (id) => {
    const existente = await Usuario.findByPk(id);
    if (!existente) return false;
    await existente.destroy();
    return true;
};
