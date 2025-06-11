const express = require('express');
const router = express.Router();
const { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productosController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes en la carpeta local
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../imagenes_productos'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// Obtener productos (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('products', 'view'), obtenerProductos);

// Crear producto (solo admin e inventario)
router.post('/', authMiddleware, checkPermission('products', 'create'), crearProducto);

// Actualizar producto (solo admin e inventario)
router.put('/:id', authMiddleware, checkPermission('products', 'update'), actualizarProducto);

// Eliminar producto (solo admin)
router.delete('/:id', authMiddleware, checkPermission('products', 'delete'), eliminarProducto);

// Endpoint para subir imagen de producto
router.post('/upload-imagen', upload.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se subió ninguna imagen' });
    }
    res.json({
        mensaje: 'Imagen subida exitosamente',
        nombre_archivo: req.file.filename,
        url: `/api/imagenes/productos/${req.file.filename}`
    });
});

module.exports = router;
