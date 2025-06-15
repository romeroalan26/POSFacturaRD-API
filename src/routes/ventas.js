const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas, obtenerVenta, eliminarVenta, exportarVentas, exportarVentasPDF } = require('../controllers/ventasController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Registrar venta (solo admin y cajero)
router.post('/', authMiddleware, checkPermission('sales', 'create'), registrarVenta);

// Obtener ventas (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('sales', 'view'), obtenerVentas);

// Obtener una venta específica
router.get('/:id', authMiddleware, checkPermission('sales', 'view'), obtenerVenta);

// Eliminar venta (solo admin)
router.delete('/:id', authMiddleware, checkPermission('sales', 'delete'), eliminarVenta);

// Exportar ventas a CSV
router.get('/exportar/csv', authMiddleware, checkPermission('sales', 'view'), exportarVentas);

// Exportar ventas a PDF
router.get('/exportar/pdf', authMiddleware, checkPermission('sales', 'view'), exportarVentasPDF);

module.exports = router;
