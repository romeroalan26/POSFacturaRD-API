const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
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

module.exports = app;
