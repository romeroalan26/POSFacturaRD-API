const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    // Capturar el tiempo de inicio
    const start = Date.now();

    // Función para registrar la respuesta
    const logResponse = () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        // Si hay un error, incluir el mensaje
        if (res.statusCode >= 400) {
            logData.error = res.locals.error || 'Error desconocido';
        }

        // Registrar según el nivel de respuesta
        if (res.statusCode >= 500) {
            logger.error('Error del servidor', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Error del cliente', logData);
        } else {
            logger.info('Petición exitosa', logData);
        }
    };

    // Registrar cuando la respuesta termine
    res.on('finish', logResponse);

    next();
};

module.exports = requestLogger; 