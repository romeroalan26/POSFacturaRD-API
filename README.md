# POSFacturaRD API

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-blue)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-lightgrey)](https://expressjs.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-green)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sistema backend para punto de venta (POS) orientado a mipymes como bares, discotecas y negocios pequeños. Esta API permite gestionar productos, inventario, ventas y reportes, con control automático de stock y documentación Swagger.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles y Permisos](#-roles-y-permisos)
- [API Endpoints](#-api-endpoints)
- [Validaciones](#-validaciones)
- [Logging](#-logging)
- [Scripts de Mantenimiento](#-scripts-de-mantenimiento)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

- 🔐 **Autenticación y Seguridad**

  - Autenticación JWT
  - Roles y permisos granularizados
  - Encriptación de contraseñas con bcrypt
  - Protección contra ataques comunes

- 📊 **Gestión de Ventas**

  - Control automático de stock
  - Validación de precios en tiempo real
  - Manejo de ITBIS configurable
  - Múltiples métodos de pago
  - Transacciones SQL atómicas

- 📈 **Reportes y Análisis**

  - Ventas diarias/mensuales
  - Productos más vendidos
  - Resumen por método de pago
  - Análisis de ganancias
  - Alertas de stock bajo

- 🔍 **Monitoreo y Logging**
  - Logging detallado de operaciones
  - Tracking de rendimiento
  - Registro de errores
  - Auditoría de cambios

## 🛠 Tecnologías

- **Backend**

  - Node.js v18.x
  - Express v4.x
  - PostgreSQL v14
  - JWT para autenticación
  - Bcrypt para encriptación

- **Documentación**

  - Swagger/OpenAPI 3.0
  - JSDoc para documentación de código

- **Logging y Monitoreo**

  - Winston para logging
  - Morgan para HTTP request logging

- **Despliegue**
  - Compatible con Raspberry Pi
  - Preparado para Vercel/Railway
  - Docker support (próximamente)

## 📋 Requisitos

- Node.js v18 o superior
- PostgreSQL v14 o superior
- npm o yarn
- 1GB RAM mínimo
- 10GB espacio en disco

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/romeroalan26/POSFacturaRD-API.git
   cd POSFacturaRD-API
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar migraciones**

   ```bash
   npm run migrate
   ```

5. **Iniciar el servidor**

   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm start
   ```

## ⚙️ Configuración

### Variables de Entorno

```ini
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_clave
DB_NAME=posdb

# Aplicación
PORT=4100
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# Impuestos
ITBIS_RATE=0.18

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 📁 Estructura del Proyecto

```
src/
├── app.js              # Configuración de Express
├── swagger.js          # Configuración de Swagger
├── controllers/        # Lógica de negocio
├── routes/            # Definición de rutas
├── db/                # Configuración de base de datos
│   ├── index.js       # Conexión a la base de datos
│   ├── migrate.js     # Script de migración
│   └── migrations/    # Migraciones SQL
├── docs/              # Documentación Swagger
├── middleware/        # Middlewares
├── utils/            # Utilidades
└── config/           # Configuraciones
```

## 👥 Roles y Permisos

### Roles del Sistema

| Rol          | Descripción         | Permisos Clave                             |
| ------------ | ------------------- | ------------------------------------------ |
| `admin`      | Dueño o supervisor  | Acceso total al sistema                    |
| `cajero`     | Operador de caja    | Registrar ventas, ver productos            |
| `inventario` | Encargado de stock  | Gestionar productos, ver reportes de stock |
| `invitado`   | Rol de solo lectura | Consultar productos y reportes             |

### Matriz de Permisos

| Módulo    | admin | cajero | inventario | invitado |
| --------- | ----- | ------ | ---------- | -------- |
| Productos | CRUD  | R      | CRU        | R        |
| Ventas    | CRUD  | CR     | -          | R        |
| Reportes  | CRUD  | R      | R          | R        |
| Usuarios  | CRUD  | -      | -          | -        |
| Config    | CRUD  | -      | -          | -        |

## 📡 API Endpoints

### Autenticación

```http
POST /api/auth/register
POST /api/auth/login
```

### Productos

```http
GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
```

### Ventas

```http
POST /api/ventas
GET  /api/ventas
GET  /api/ventas/:id
```

### Reportes

```http
GET /api/reportes/ventas-diarias
GET /api/reportes/productos-mas-vendidos
GET /api/reportes/resumen-metodo-pago
GET /api/reportes/ganancias
```

## ✅ Validaciones

### Productos

- Nombre único (máx. 100 caracteres)
- Precio positivo
- Stock no negativo
- ITBIS configurable

### Ventas

- Stock disponible
- Precios actualizados
- Métodos de pago válidos
- Transacciones atómicas

### Usuarios

- Email único y válido
- Contraseña segura
- Nombre obligatorio

## 📝 Logging

- **Niveles de Log**

  - ERROR: Errores críticos
  - WARN: Advertencias
  - INFO: Información general
  - DEBUG: Información detallada

- **Formato**
  ```json
  {
    "timestamp": "2024-03-15T12:00:00Z",
    "level": "info",
    "message": "Venta registrada",
    "metadata": {
      "venta_id": 123,
      "usuario": "admin"
    }
  }
  ```

## 🔧 Scripts de Mantenimiento

Los scripts de mantenimiento están en `src/scripts/`:

- `limpiar_ventas.sql`: Limpieza de ventas
- `saneamiento_demo.sql`: Preparación para demo
- `insert_productos_iniciales.sql`: Datos iniciales

## 🚀 Despliegue

### Raspberry Pi

```bash
# Instalar dependencias
sudo apt-get update
sudo apt-get install nodejs npm postgresql

# Configurar PostgreSQL
sudo -u postgres createuser -s $USER
createdb posdb

# Desplegar aplicación
npm install
npm run migrate
npm start
```

### Vercel/Railway

1. Conectar repositorio
2. Configurar variables de entorno
3. Desplegar

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte, email alanromero26@gmail.com o crear un issue en el repositorio.
