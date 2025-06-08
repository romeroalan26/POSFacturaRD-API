/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para gestionar el inventario de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
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
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error del servidor
 *                 detalle:
 *                   type: string
 *                   example: Error al obtener los productos
 */

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
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
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error del servidor
 *                 detalle:
 *                   type: string
 *                   example: Error al crear el producto
 */

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del producto a actualizar
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
 *       200:
 *         description: Producto actualizado exitosamente
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
 *                     "ID de producto inválido",
 *                     "El precio debe ser un número positivo",
 *                     "El campo con_itbis debe ser true o false",
 *                     "Ya existe otro producto con este nombre"
 *                   ]
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error del servidor
 *                 detalle:
 *                   type: string
 *                   example: Error al actualizar el producto
 */

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto eliminado
 *                 producto:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Producto A"
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
 *                     "ID de producto inválido",
 *                     "No se puede eliminar el producto porque está asociado a ventas existentes"
 *                   ]
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Producto no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error del servidor
 *                 detalle:
 *                   type: string
 *                   example: Error al eliminar el producto
 */
