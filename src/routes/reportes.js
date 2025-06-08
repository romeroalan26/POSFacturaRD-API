const express = require('express');
const router = express.Router();
const { obtenerVentasDiarias, obtenerProductosMasVendidos, obtenerResumenPorMetodoPago } = require('../controllers/reportesController');

router.get('/diario', obtenerVentasDiarias);
router.get('/productos', obtenerProductosMasVendidos );
router.get('/metodos-pago', obtenerResumenPorMetodoPago);

module.exports = router;
