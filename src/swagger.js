const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POSFacturaRD API',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema POS con inventario y ventas',
    },
    servers: [
      {
        url: 'http://localhost:4100',
        description: 'Servidor local de desarrollo',
      },
    ],
  },
  apis: ['./src/docs/*.swagger.js'], // ← Ruta corregida a archivos separados
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
