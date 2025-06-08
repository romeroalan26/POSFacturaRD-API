const db = require('../db');

const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            // Obtener el rol del usuario
            const userResult = await db.query(
                'SELECT r.permissions FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
                [req.user.id]
            );

            if (userResult.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario no tiene un rol asignado'
                });
            }

            const permissions = userResult.rows[0].permissions;

            // Verificar si el usuario tiene el permiso necesario
            if (!permissions[resource] || !permissions[resource][action]) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al verificar permisos'
            });
        }
    };
};

module.exports = checkPermission; 