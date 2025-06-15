const db = require('../db');

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el usuario existe
        const usuarioExistente = await db.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [id]
        );

        if (usuarioExistente.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // No permitir eliminar el último administrador
        const esAdmin = usuarioExistente.rows[0].rol === 'admin';
        if (esAdmin) {
            const totalAdmins = await db.query(
                'SELECT COUNT(*) FROM usuarios WHERE rol = $1',
                ['admin']
            );
            if (parseInt(totalAdmins.rows[0].count) <= 1) {
                return res.status(400).json({
                    mensaje: 'No se puede eliminar el último administrador del sistema'
                });
            }
        }

        // Eliminar el usuario
        await db.query(
            'DELETE FROM usuarios WHERE id = $1',
            [id]
        );

        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
};

module.exports = {
    eliminarUsuario
}; 