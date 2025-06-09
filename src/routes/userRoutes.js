const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const { getUsers, updateUserRole, getUserPermissions } = require('../controllers/userController');

// Obtener todos los usuarios (solo admin)
router.get('/', authMiddleware, checkPermission('users', 'view'), getUsers);

// Actualizar rol de usuario (solo admin)
router.put('/:userId/role', authMiddleware, checkPermission('users', 'update'), updateUserRole);

// Obtener permisos de un usuario (solo admin)
router.get('/:userId/permissions', authMiddleware, checkPermission('users', 'view'), getUserPermissions);

module.exports = router; 