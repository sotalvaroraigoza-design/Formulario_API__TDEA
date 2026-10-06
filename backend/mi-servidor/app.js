const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());          // permite que el formulario (otro origen) consuma la API
app.use(express.json());

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
