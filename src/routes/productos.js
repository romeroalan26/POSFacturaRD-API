const express = require('express');
const router = express.Router();
const { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productosController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Obtener productos (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('products', 'view'), obtenerProductos);

// Crear producto (solo admin e inventario)
router.post('/', authMiddleware, checkPermission('products', 'create'), crearProducto);

// Actualizar producto (solo admin e inventario)
router.put('/:id', authMiddleware, checkPermission('products', 'update'), actualizarProducto);

// Eliminar producto (solo admin)
router.delete('/:id', authMiddleware, checkPermission('products', 'delete'), eliminarProducto);

module.exports = router;
