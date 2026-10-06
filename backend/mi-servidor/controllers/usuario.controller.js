const usuarioService = require('../services/usuario.service');

// Traduce un error a una respuesta HTTP
function responderError(res, err) {
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'Ya existe un usuario con ese tipo y número de documento' });
    }
    const status = err.status || 500;
    res.status(status).json({ mensaje: err.message || 'Error interno del servidor' });
}

exports.getAll = (req, res) => {
    usuarioService.getAll((err, results) => {
        if (err) return responderError(res, err);
        res.json(results);
    });
};

exports.getById = (req, res) => {
    usuarioService.getById(req.params.id, (err, results) => {
        if (err) return responderError(res, err);
        if (results.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(results[0]);
    });
};

exports.create = (req, res) => {
    usuarioService.create(req.body, (err, result, usuario) => {
        if (err) return responderError(res, err);
        res.status(201).json({ id: result.insertId, ...usuario });
    });
};

exports.update = (req, res) => {
    usuarioService.update(req.params.id, req.body, (err, result) => {
        if (err) return responderError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado' });
    });
};

exports.delete = (req, res) => {
    usuarioService.delete(req.params.id, (err, result) => {
        if (err) return responderError(res, err);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado' });
    });
};
