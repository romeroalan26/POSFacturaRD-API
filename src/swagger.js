const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POSFacturaRD API',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema POS con inventario y ventas',
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@posfacturard.com'
      },
      license: {
        name: 'Privado',
        url: 'https://posfacturard.com/licencia'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4100',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token para autenticación. Obtener el token mediante el endpoint /api/auth/login'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y gestión de usuarios'
      },
      {
        name: 'Productos',
        description: 'Gestión del inventario de productos'
      },
      {
        name: 'Ventas',
        description: 'Gestión de ventas y facturación'
      },
      {
        name: 'Reportes',
        description: 'Generación y consulta de reportes'
      }
    ]
  },
  apis: ['./src/docs/*.swagger.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
