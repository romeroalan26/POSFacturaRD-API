const express = require('express');
const router = express.Router();
const categoriasGastosController = require('../controllers/categoriasGastosController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

/**
 * @swagger
 * /api/categorias-gastos:
 *   get:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Obtener todas las categorías de gastos
 *     description: Retorna una lista paginada de categorías de gastos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Tamaño de página
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar categorías
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, checkPermission('expenses', 'view'), categoriasGastosController.obtenerCategorias);

/**
 * @swagger
 * /api/categorias-gastos/{id}:
 *   get:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Obtener una categoría de gasto específica
 *     description: Retorna los detalles de una categoría de gasto por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGasto'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, checkPermission('expenses', 'view'), categoriasGastosController.obtenerCategoria);

/**
 * @swagger
 * /api/categorias-gastos:
 *   post:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Crear una nueva categoría de gasto
 *     description: Crea una nueva categoría de gasto (requiere permisos de administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGasto'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, checkPermission('expenses', 'create'), categoriasGastosController.crearCategoria);

/**
 * @swagger
 * /api/categorias-gastos/{id}:
 *   put:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Actualizar una categoría de gasto
 *     description: Actualiza los datos de una categoría de gasto existente (requiere permisos de administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la categoría
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la categoría
 *               is_active:
 *                 type: boolean
 *                 description: Estado de la categoría (activo/inactivo)
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriaGasto'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, checkPermission('expenses', 'update'), categoriasGastosController.actualizarCategoria);

/**
 * @swagger
 * /api/categorias-gastos/{id}:
 *   delete:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Eliminar una categoría de gasto
 *     description: Elimina una categoría de gasto (requiere permisos de administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, checkPermission('expenses', 'delete'), categoriasGastosController.eliminarCategoria);

module.exports = router; 