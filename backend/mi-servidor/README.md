# Estructura

mi-servidor/
├── config/database.js                # conexión Sequelize (mysql | mssql)
├── controllers/usuario.controller.js # recibe la petición y responde (HTTP)
├── models/usuario.model.js           # modelo Sequelize (tabla usuarios)
├── routes/usuario.routes.js          # endpoints
├── services/usuario.service.js       # lógica / validaciones + uso del modelo
├── app.js                            # arranque: autentica, sincroniza y levanta Express
├── database.sql                      # (opcional) script SQL equivalente
└── package.json

## Puesta en marcha

1. Tener un servidor MySQL corriendo y crear la base de datos vacía (la tabla la crea Sequelize):
   ```sql
   CREATE DATABASE IF NOT EXISTS demo;
   ```
2. Instalar dependencias y arrancar:
   ```
   npm install
   npm start
   ```
   Debe mostrar `Conectado a la base de datos con Sequelize` y `Servidor corriendo en http://localhost:3000`.
   Al arrancar, `sequelize.sync()` crea la tabla `usuarios` si no existe.

   ### Configuración de la base de datos

Valores por defecto: MySQL en `localhost:3306`, base `demo`, usuario `root`, contraseña `123456`.
Se cambian con variables de entorno (PowerShell):

```
$env:DB_PORT=3307
$env:DB_USER="mi_usuario"
$env:DB_PASSWORD="mi_clave"
npm start
```

| Variable      | Descripción                                   | Por defecto (mysql / mssql) |
|---------------|-----------------------------------------------|-----------------------------|
| DB_TYPE       | Motor: `mysql` o `mssql`                      | mysql                       |
| DB_HOST       | Servidor                                      | localhost                   |
| DB_PORT       | Puerto                                        | 3306 / 1433                 |
| DB_NAME       | Nombre de la base de datos                    | demo                        |
| DB_USER       | Usuario                                       | root / sa                   |
| DB_PASSWORD   | Contraseña                                    | 123456                      |

Para usar SQL Server: `$env:DB_TYPE="mssql"` y luego `npm start`.

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
