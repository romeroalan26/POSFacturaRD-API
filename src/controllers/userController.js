const pool = require('../db');
const { checkPermission } = require('../middleware/checkPermission');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.nombre, u.email, u.role_id, r.name as role_nombre 
             FROM usuarios u 
             LEFT JOIN roles r ON u.role_id = r.id 
             ORDER BY u.id`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

// Actualizar rol de usuario
const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role_id } = req.body;

    try {
        // Verificar que el rol existe
        const roleCheck = await pool.query('SELECT id FROM roles WHERE id = $1', [role_id]);
        if (roleCheck.rows.length === 0) {
            return res.status(400).json({ mensaje: 'El rol especificado no existe' });
        }

        // Verificar que el usuario existe
        const userCheck = await pool.query('SELECT id FROM usuarios WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Actualizar el rol del usuario
        await pool.query('UPDATE usuarios SET role_id = $1 WHERE id = $2', [role_id, userId]);

        // Obtener el usuario actualizado
        const result = await pool.query(
            `SELECT u.id, u.nombre, u.email, u.role_id, r.name as role_nombre 
             FROM usuarios u 
             LEFT JOIN roles r ON u.role_id = r.id 
             WHERE u.id = $1`,
            [userId]
        );

        res.json({
            mensaje: 'Rol actualizado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ mensaje: 'Error al actualizar rol del usuario' });
    }
};

// Obtener permisos de un usuario
const getUserPermissions = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.permissions 
             FROM usuarios u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({
            permisos: result.rows[0].permissions
        });
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ mensaje: 'Error al obtener permisos del usuario' });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    getUserPermissions
}; 