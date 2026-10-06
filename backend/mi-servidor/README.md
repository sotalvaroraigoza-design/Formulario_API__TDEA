# Estructura

mi-servidor/
├── config/db.js                      # conexión a MySQL
├── controllers/usuario.controller.js # recibe la petición y responde (HTTP)
├── models/usuario.model.js           # consultas SQL (DAO)
├── routes/usuario.routes.js          # endpoints
├── services/usuario.service.js       # lógica / validaciones
├── app.js                            # arranque del servidor
├── database.sql                      # script para crear la BD y la tabla
└── package.json

## Puesta en marcha

   npm install
   npm start
   El servidor queda en `http://localhost:3000`.

## Endpoints

| Método | Endpoint        | Acción      |
|--------|-----------------|-------------|
| GET    | /usuarios       | Listar      |
| GET    | /usuarios/:id   | Obtener uno |
| POST   | /usuarios       | Crear       |
| PUT    | /usuarios/:id   | Actualizar  |
| DELETE | /usuarios/:id   | Eliminar    |

Ejemplo de cuerpo (POST / PUT):

```json
{
  "tipoDocumento": "CC",
  "numeroDocumento": "123456",
  "nombres": "Ana",
  "apellidos": "Pérez",
  "direccion": "Calle 1 #2-3",
  "ciudad": "medellin",
  "fechaNacimiento": "2000-05-20",
  "correo": "ana@correo.com"
}
```

Respuestas de error: `400` (datos incompletos o correo inválido), `404` (usuario no existe),
`409` (ya existe ese tipo + número de documento), `500` (error del servidor).
