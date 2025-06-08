# POSFacturaRD API

Sistema backend para punto de venta (POS) orientado a mipymes como bares, discotecas y negocios pequeños. Esta API permite gestionar productos, inventario, ventas y reportes, con control automático de stock y documentación Swagger.

## 🛠 Tecnologías

- Node.js + Express
- PostgreSQL
- Swagger (OpenAPI 3.0)
- Winston (Logging)
- Morgan (HTTP Request Logging)
- JWT (Autenticación)
- Bcrypt (Encriptación)
- Cloud-ready para Raspberry Pi o Vercel/Railway

## 📦 Estructura del Proyecto

```
src/
├── controllers/     # Lógica de negocio
├── routes/         # Definición de rutas
├── db/            # Configuración de base de datos
├── docs/          # Documentación Swagger
├── middleware/    # Middlewares (logging, auth, etc)
├── utils/         # Utilidades y helpers
└── app.js         # Configuración de Express
```

## 🔄 Módulos y Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos

- `GET /productos` - Listar todos los productos
- `POST /productos` - Crear nuevo producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Ventas

- `POST /ventas` - Registrar nueva venta
- `GET /ventas` - Listar ventas con filtros y paginación

### Reportes

- `GET /reportes/diario` - Ventas agrupadas por día
- `GET /reportes/productos` - Productos más vendidos
- `GET /reportes/metodos-pago` - Resumen por método de pago

## ✨ Características

- ✅ Autenticación JWT
- ✅ Control automático de stock
- ✅ Validación de precios en tiempo real
- ✅ Manejo de ITBIS por producto
- ✅ Reportes detallados
- ✅ Logging de operaciones
- ✅ Documentación Swagger completa
- ✅ Transacciones SQL para operaciones críticas
- ✅ Paginación y filtros en listados
- ✅ Manejo de errores detallado

## 📋 Roles y Permisos

El sistema implementa cuatro roles con diferentes niveles de acceso:

| Rol          | Descripción breve                                             | Permisos clave                                                                     |
| ------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `admin`      | Dueño o supervisor. Accede a todo.                            | Ver/editar productos, ventas, reportes, usuarios.                                  |
| `cajero`     | Operador de caja. Vende productos.                            | Solo registrar ventas, ver productos, **sin modificar datos**.                     |
| `inventario` | Encargado de stock.                                           | Agrega/edita productos, ve reportes de stock, **no puede facturar ni ver ventas**. |
| `invitado`   | Rol opcional, solo lectura. Ideal para pruebas o vistas demo. | Puede consultar productos y reportes, **sin escribir nada**.                       |

### Detalle de Permisos por Ruta

#### Autenticación (`/api/auth`)

- `POST /register`: Público
- `POST /login`: Público

#### Productos (`/api/productos`)

- `GET /`: Todos los roles pueden ver
- `POST /`: Solo admin e inventario pueden crear
- `PUT /:id`: Solo admin e inventario pueden actualizar
- `DELETE /:id`: Solo admin puede eliminar

#### Ventas (`/api/ventas`)

- `GET /`: Todos los roles pueden ver
- `POST /`: Solo admin y cajero pueden crear

#### Reportes (`/api/reportes`)

- `GET /ventas-diarias`: Todos los roles pueden ver
- `GET /productos-mas-vendidos`: Todos los roles pueden ver
- `GET /resumen-metodo-pago`: Todos los roles pueden ver

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
   JWT_SECRET=tu_clave_secreta_muy_segura
   ```

4. Ejecutar migraciones:

   ```bash
   npm run migrate
   ```

5. Iniciar servidor:

   ```bash
   # Desarrollo (con nodemon)
   npm run dev

   # Producción
   npm start
   ```

6. Acceder a la documentación Swagger:
   ```
   http://localhost:4100/api-docs
   ```

## 📝 Validaciones

### Autenticación

- Email único y válido
- Contraseña mínima de 6 caracteres
- Nombre obligatorio
- Token JWT válido para rutas protegidas

### Productos

- Nombre único y obligatorio (máx. 100 caracteres)
- Precio positivo y obligatorio
- Stock no negativo
- ITBIS como booleano (true/false)

### Ventas

- Validación de stock disponible
- Verificación de precios actualizados
- Métodos de pago válidos (efectivo, tarjeta, transferencia)
- Transacciones atómicas

### Reportes

- Fechas válidas y en orden
- Límites de paginación
- Filtros por método de pago

## 🔍 Logging

- Registro de todas las operaciones
- Logs de errores detallados
- Tracking de rendimiento
- Almacenamiento en archivos por fecha

## 🔒 Autenticación

### Registro de Usuario

```bash
POST /api/auth/register
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123",
    "nombre": "Nombre Usuario"
}
```

### Inicio de Sesión

```bash
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}
```

### Uso del Token

Para acceder a rutas protegidas, incluir el token en el header:

```
Authorization: Bearer tu_token_jwt
```

## 🧾 Licencia

MIT © Alan Joel Romero De Oleo
