const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models/usuario.model'); // registra el modelo en Sequelize

const app = express();

app.use(cors());          // permite que el formulario (otro origen) consuma la API
app.use(express.json());

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;

// Primero se comprueba la conexión a la BD; sync() crea la tabla si no existe
sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos con Sequelize');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error de conexión:', err.message);
    });
