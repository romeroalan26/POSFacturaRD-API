const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POSFacturaRD API',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema POS',
    },
    servers: [
      { url: 'http://localhost:4100' },
    ],
  },
  apis: ['./src/docs/*.swagger.js'], // ← aquí está la diferencia
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
