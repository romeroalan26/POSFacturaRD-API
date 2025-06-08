# POSFacturaRD API

Sistema backend para punto de venta (POS) orientado a mipymes como bares, discotecas y negocios pequeños. Esta API permite gestionar productos, inventario, ventas y reportes, con control automático de stock y documentación Swagger.

## 🛠 Tecnologías

- Node.js + Express
- PostgreSQL
- Swagger (OpenAPI 3.0)
- Cloud-ready para Raspberry Pi o Vercel/Railway

## 📦 Estructura de módulos

| Módulo     | Endpoints principales                                                              |
| ---------- | ---------------------------------------------------------------------------------- |
| Productos  | `GET /productos`, `POST /productos`, `PUT /productos/:id`, `DELETE /productos/:id` |
| Ventas     | `POST /ventas`, `GET /ventas`                                                      |
| Reportes   | `GET /reportes/diario`, `GET /reportes/productos`, `GET /reportes/metodos-pago`    |
| Inventario | Control automático por stock de productos                                          |
| Usuarios   | (Opcional) `POST /login`, `GET /usuarios`, `POST /usuarios`                        |

## 🚀 Cómo ejecutar

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/romeroalan26/POSFacturaRD-API.git
   cd POSFacturaRD-API
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear archivo `.env`:

   ```ini
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_clave
   DB_NAME=posdb
   PORT=4100
   ```

4. Iniciar servidor:

   ```bash
   node server.js
   ```

5. Acceder a la documentación Swagger:
   ```
   http://localhost:4100/api-docs
   ```

## 🧾 Licencia

MIT © Alan Joel Romero De Oleo
