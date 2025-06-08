const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');

const app = express();

// Middleware de logging
app.use(requestLogger);

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productosRoutes = require('./routes/productos');
app.use('/productos', productosRoutes);
const ventasRoutes = require('./routes/ventas');
app.use('/ventas', ventasRoutes);
const reportesRoutes = require('./routes/reportes');
app.use('/reportes', reportesRoutes);

// Prueba
app.get('/', (req, res) => {
  res.send('POS Backend corriendo correctamente 🚀');
});

// Manejador de errores global
app.use((err, req, res, next) => {
  logger.error('Error no manejado:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;
