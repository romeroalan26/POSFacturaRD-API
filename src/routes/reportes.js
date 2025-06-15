const express = require('express');
const router = express.Router();
const {
    obtenerVentasDiarias,
    obtenerProductosMasVendidos,
    obtenerResumenPorMetodoPago,
    obtenerResumenGeneral,
    obtenerVentasPorHora,
    obtenerTendenciaVentas,
    obtenerProductosBajoStock,
    obtenerReporteGanancias
} = require('../controllers/reportesController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Todos los reportes requieren permiso de visualización
router.get('/ventas-diarias', authMiddleware, checkPermission('reports', 'view'), obtenerVentasDiarias);
router.get('/productos-mas-vendidos', authMiddleware, checkPermission('reports', 'view'), obtenerProductosMasVendidos);
router.get('/resumen-metodo-pago', authMiddleware, checkPermission('reports', 'view'), obtenerResumenPorMetodoPago);
router.get('/resumen-general', authMiddleware, checkPermission('reports', 'view'), obtenerResumenGeneral);
router.get('/ventas-por-hora', authMiddleware, checkPermission('reports', 'view'), obtenerVentasPorHora);
router.get('/tendencia-ventas', authMiddleware, checkPermission('reports', 'view'), obtenerTendenciaVentas);
router.get('/productos-bajo-stock', authMiddleware, checkPermission('reports', 'view'), obtenerProductosBajoStock);
router.get('/ganancias', authMiddleware, checkPermission('reports', 'view'), obtenerReporteGanancias);

module.exports = router;
