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
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              description: 'Mensaje de error',
            },
            errores: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de errores de validación',
            },
          },
        },
        CategoriaGasto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID de la categoría',
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la categoría',
            },
            is_active: {
              type: 'boolean',
              description: 'Estado de la categoría (activo/inactivo)',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        Gasto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID del gasto',
            },
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha del gasto',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del gasto',
            },
            monto: {
              type: 'number',
              description: 'Monto del gasto',
            },
            categoria_id: {
              type: 'integer',
              description: 'ID de la categoría del gasto',
            },
            usuario_id: {
              type: 'integer',
              description: 'ID del usuario que registró el gasto',
            },
            categoria_nombre: {
              type: 'string',
              description: 'Nombre de la categoría del gasto',
            },
            usuario_nombre: {
              type: 'string',
              description: 'Nombre del usuario que registró el gasto',
            },
            usuario_email: {
              type: 'string',
              description: 'Email del usuario que registró el gasto',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Gasto',
              },
            },
            page: {
              type: 'integer',
              description: 'Número de página actual',
            },
            size: {
              type: 'integer',
              description: 'Tamaño de página',
            },
            totalElements: {
              type: 'integer',
              description: 'Total de elementos',
            },
            totalPages: {
              type: 'integer',
              description: 'Total de páginas',
            },
            buscar: {
              type: 'string',
              description: 'Término de búsqueda',
              nullable: true,
            },
          },
        },
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
      },
      {
        name: 'Gastos',
        description: 'Gestión de gastos'
      },
      {
        name: 'Categorías de Gastos',
        description: 'Gestión de categorías de gastos'
      }
    ]
  },
  apis: ['./src/docs/*.swagger.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
