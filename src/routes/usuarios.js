const express = require('express');
const router = express.Router();
const { eliminarUsuario } = require('../controllers/usuariosController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Elimina un usuario
 *     description: |
 *       Elimina un usuario del sistema.
 *       Nota: No se puede eliminar el último administrador del sistema.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el último administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: No se puede eliminar el último administrador del sistema
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, checkPermission('users', 'delete'), eliminarUsuario);

module.exports = router; 