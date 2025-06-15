const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastosController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Obtener todos los gastos
router.get('/', authMiddleware, checkPermission('expenses', 'view'), gastosController.obtenerGastos);

// Obtener un gasto específico
router.get('/:id', authMiddleware, checkPermission('expenses', 'view'), gastosController.obtenerGasto);

// Crear nuevo gasto
router.post('/', authMiddleware, checkPermission('expenses', 'create'), gastosController.crearGasto);

// Actualizar un gasto
router.put('/:id', authMiddleware, checkPermission('expenses', 'update'), gastosController.actualizarGasto);

// Eliminar un gasto
router.delete('/:id', authMiddleware, checkPermission('expenses', 'delete'), gastosController.eliminarGasto);

module.exports = router; 