/**
 * @swagger
 * components:
 *   schemas:
 *     CategoriaGasto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la categoría de gasto
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría de gasto
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría de gasto
 *         is_active:
 *           type: boolean
 *           description: Estado de la categoría. Si es false, la categoría no podrá ser asignada a nuevos gastos, pero los gastos existentes mantendrán su referencia a esta categoría.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       required:
 *         - nombre
 *         - is_active
 */

/**
 * @swagger
 * /api/categorias-gastos:
 *   get:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Obtener todas las categorías de gastos
 *     description: |
 *       Retorna una lista paginada de categorías de gastos.
 *       Nota importante: Las categorías inactivas (is_active=false) seguirán apareciendo en los gastos que las tengan asignadas,
 *       pero no podrán ser asignadas a nuevos gastos.
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
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo/inactivo
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoriaGasto'
 *                 page:
 *                   type: integer
 *                   description: Número de página actual
 *                 size:
 *                   type: integer
 *                   description: Tamaño de página
 *                 totalElements:
 *                   type: integer
 *                   description: Total de elementos
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 buscar:
 *                   type: string
 *                   nullable: true
 *                 is_active:
 *                   type: boolean
 *                   nullable: true
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

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
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CategoriaGasto'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

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
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CategoriaGasto'
 *                 mensaje:
 *                   type: string
 *                   example: Categoría creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       500:
 *         description: Error del servidor
 */

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
 *               activo:
 *                 type: boolean
 *                 description: Estado de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CategoriaGasto'
 *                 mensaje:
 *                   type: string
 *                   example: Categoría actualizada exitosamente
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

/**
 * @swagger
 * /api/categorias-gastos/{id}:
 *   delete:
 *     tags:
 *       - Categorías de Gastos
 *     summary: Eliminar una categoría de gasto
 *     description: |
 *       Elimina una categoría de gasto (requiere permisos de administrador).
 *       Nota: No se puede eliminar una categoría que tenga gastos asociados.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Categoría eliminada exitosamente
 *       400:
 *         description: No se puede eliminar la categoría porque tiene gastos asociados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: No se puede eliminar la categoría porque tiene gastos asociados
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para realizar esta acción
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */ 