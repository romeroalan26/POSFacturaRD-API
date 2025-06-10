const express = require('express');
const router = express.Router();
const { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoriasController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Obtener categorías (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('products', 'view'), obtenerCategorias);

// Crear categoría (solo admin e inventario)
router.post('/', authMiddleware, checkPermission('products', 'create'), crearCategoria);

// Actualizar categoría (solo admin e inventario)
router.put('/:id', authMiddleware, checkPermission('products', 'update'), actualizarCategoria);

// Eliminar categoría (solo admin)
router.delete('/:id', authMiddleware, checkPermission('products', 'delete'), eliminarCategoria);

module.exports = router; 