const usuarioService = require('../services/usuario.service');

// Traduce un error a una respuesta HTTP
function responderError(res, err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensaje: 'Ya existe un usuario con ese tipo y número de documento' });
    }
    const status = err.status || 500;
    res.status(status).json({ mensaje: err.message || 'Error interno del servidor' });
}

exports.getAll = async (req, res) => {
    try {
        res.json(await usuarioService.getAll());
    } catch (err) {
        responderError(res, err);
    }
};

exports.getById = async (req, res) => {
    try {
        const usuario = await usuarioService.getById(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        responderError(res, err);
    }
};

exports.create = async (req, res) => {
    try {
        const usuario = await usuarioService.create(req.body);
        res.status(201).json(usuario);
    } catch (err) {
        responderError(res, err);
    }
};

exports.update = async (req, res) => {
    try {
        const usuario = await usuarioService.update(req.params.id, req.body);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (err) {
        responderError(res, err);
    }
};

exports.delete = async (req, res) => {
    try {
        const eliminado = await usuarioService.delete(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (err) {
        responderError(res, err);
    }
}