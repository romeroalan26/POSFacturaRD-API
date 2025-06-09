const logger = require('../utils/logger');

// Manejador de errores personalizado
const errorHandler = (err, req, res, next) => {
    // Log del error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user ? req.user.id : 'no-auth'
    });

    // Errores de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: err.errors
        });
    }

    // Errores de autenticación
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'No autorizado'
        });
    }

    // Errores de base de datos
    if (err.code === '23505') { // Violación de restricción única
        return res.status(400).json({
            success: false,
            message: 'El registro ya existe'
        });
    }

    if (err.code === '23503') { // Violación de clave foránea
        return res.status(400).json({
            success: false,
            message: 'Referencia inválida'
        });
    }

    // Error por defecto
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler; 