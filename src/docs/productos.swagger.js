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
 *     summary: Obtiene la lista de productos
 *     tags: [Productos]
 *     description: Retorna la lista de productos con paginación y filtros. Los productos se ordenan por estado (activos primero) y luego por ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Buscar por nombre de producto
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filtrar por productos activos (true) o inactivos (false)
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       precio:
 *                         type: string
 *                         format: float
 *                       stock:
 *                         type: integer
 *                       con_itbis:
 *                         type: boolean
 *                       categoria_id:
 *                         type: integer
 *                         nullable: true
 *                       categoria_nombre:
 *                         type: string
 *                         nullable: true
 *                       imagen:
 *                         type: string
 *                         nullable: true
 *                         description: Nombre del archivo de la imagen del producto
 *                       is_active:
 *                         type: boolean
 *                         description: Indica si el producto está activo o inactivo
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 size:
 *                   type: integer
 *                   example: 10
 *                 totalElements:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 categoria_id:
 *                   type: integer
 *                   nullable: true
 *                 buscar:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver productos
 *       500:
 *         description: Error del servidor
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
 *               precio:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Precio del producto (debe ser mayor a 0)
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en inventario (debe ser 0 o mayor)
 *               con_itbis:
 *                 type: boolean
 *                 default: false
 *                 description: Indica si el producto tiene ITBIS
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: string
 *                       format: float
 *                     stock:
 *                       type: integer
 *                     con_itbis:
 *                       type: boolean
 *                     categoria_id:
 *                       type: integer
 *                       nullable: true
 *                 mensaje:
 *                   type: string
 *                   example: "Producto creado exitosamente"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error de validación"
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["El nombre es obligatorio", "El precio debe ser un número positivo"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para crear productos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
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
 *                 description: Nombre del producto (máximo 100 caracteres)
 *               precio:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Precio del producto (debe ser mayor a 0)
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en inventario (debe ser 0 o mayor)
 *               con_itbis:
 *                 type: boolean
 *                 description: Indica si el producto tiene ITBIS
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del producto
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: string
 *                       format: float
 *                     stock:
 *                       type: integer
 *                     con_itbis:
 *                       type: boolean
 *                     categoria_id:
 *                       type: integer
 *                       nullable: true
 *                 mensaje:
 *                   type: string
 *                   example: "Producto actualizado exitosamente"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error de validación"
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["El precio debe ser un número positivo", "El stock debe ser un número entero no negativo"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para actualizar productos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     description: Elimina un producto (soft delete). Requiere rol de admin.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: string
 *                       format: float
 *                     stock:
 *                       type: integer
 *                     con_itbis:
 *                       type: boolean
 *                     categoria_id:
 *                       type: integer
 *                       nullable: true
 *                 mensaje:
 *                   type: string
 *                   example: "Producto eliminado exitosamente"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error de validación"
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ID de producto inválido"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para eliminar productos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/productos/upload-imagen:
 *   post:
 *     summary: Subir imagen de producto
 *     tags: [Productos]
 *     description: Sube una imagen para un producto y devuelve el nombre del archivo y la URL local.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Imagen subida exitosamente
 *                 nombre_archivo:
 *                   type: string
 *                   example: imagen-1717971234567-123456789.jpg
 *                 url:
 *                   type: string
 *                   example: /api/imagenes/productos/imagen-1717971234567-123456789.jpg
 *       400:
 *         description: No se subió ninguna imagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: No se subió ninguna imagen
 */
