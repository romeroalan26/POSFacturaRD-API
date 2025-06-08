const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas } = require('../controllers/ventasController');

router.post('/', registrarVenta);
router.get('/', obtenerVentas);
module.exports = router;
