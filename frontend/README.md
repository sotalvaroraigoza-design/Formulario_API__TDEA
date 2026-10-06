# Formulario TDEA — Frontend

Formulario HTML/JS (carpeta `htmlForm`) que consume el backend `mi-servidor`
(Node + Express + MySQL) en `http://localhost:3000/usuarios`.

## Uso

1. Levantar primero el backend (ver el README de `mi-servidor`).
2. Abrir `htmlForm/formulario.html` con la extensión **Live Server** de VSCode
   (evita problemas de `fetch` al abrir el archivo con doble clic).

## Cómo funciona

- **Guardar** (`POST`): si el tipo y número de documento no existen, crea el usuario.
- **Actualizar** (`PUT`): si ya existen, se cargan sus datos y se edita el mismo registro.
- **Eliminar** (`DELETE`): borra el usuario por su `id`.
- Tras cada operación el formulario vuelve a pedir la lista (`GET`) para refrescar la tabla.
