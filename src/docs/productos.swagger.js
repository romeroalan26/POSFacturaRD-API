/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para gestionar el inventario de productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     description: Lista todos los productos. Requiere permiso de visualización.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Producto A"
 *                   precio:
 *                     type: number
 *                     example: 225.00
 *                   stock:
 *                     type: integer
 *                     example: 50
 *                   con_itbis:
 *                     type: boolean
 *                     example: true
 *                   categoria:
 *                     type: string
 *                     example: "Electrónicos"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No se proporcionó token de autenticación
 *       403:
 *         description: No tiene permiso para ver productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No tienes permiso para realizar esta acción
 */

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     description: Crea un nuevo producto. Requiere rol de admin o inventario.
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
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Nombre del producto (máximo 100 caracteres)
 *                 example: "Producto A"
 *               precio:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Precio del producto (debe ser mayor a 0)
 *                 example: 225.00
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en inventario (debe ser 0 o mayor)
 *                 example: 50
 *               con_itbis:
 *                 type: boolean
 *                 default: false
 *                 description: Indica si el producto tiene ITBIS (solo acepta true o false)
 *                 example: true
 *               categoria:
 *                 type: string
 *                 description: Categoría del producto
 *                 example: "Electrónicos"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Producto A"
 *                 precio:
 *                   type: number
 *                   example: 225.00
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 con_itbis:
 *                   type: boolean
 *                   example: true
 *                 categoria:
 *                   type: string
 *                   example: "Electrónicos"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error de validación
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [
 *                     "El nombre es obligatorio",
 *                     "El precio debe ser un número positivo",
 *                     "El campo con_itbis debe ser true o false",
 *                     "Ya existe un producto con este nombre"
 *                   ]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para crear productos
 */

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     description: Actualiza un producto existente. Requiere rol de admin o inventario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               precio:
 *                 type: number
 *                 minimum: 0.01
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               con_itbis:
 *                 type: boolean
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para actualizar productos
 *       404:
 *         description: Producto no encontrado
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     description: Elimina un producto. Requiere rol de admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para eliminar productos
 *       404:
 *         description: Producto no encontrado
 */
