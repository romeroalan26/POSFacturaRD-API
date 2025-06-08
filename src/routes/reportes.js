const express = require('express');
const router = express.Router();
const { obtenerVentasDiarias, obtenerProductosMasVendidos, obtenerResumenPorMetodoPago } = require('../controllers/reportesController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Todos los reportes requieren permiso de visualización
router.get('/ventas-diarias', authMiddleware, checkPermission('reports', 'view'), obtenerVentasDiarias);
router.get('/productos-mas-vendidos', authMiddleware, checkPermission('reports', 'view'), obtenerProductosMasVendidos);
router.get('/resumen-metodo-pago', authMiddleware, checkPermission('reports', 'view'), obtenerResumenPorMetodoPago);

module.exports = router;
