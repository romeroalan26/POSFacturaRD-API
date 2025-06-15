/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para gestionar el inventario de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - precio_compra
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         precio:
 *           type: string
 *           format: float
 *           description: Precio de venta del producto
 *         precio_compra:
 *           type: string
 *           format: float
 *           description: Precio de compra del producto
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario
 *         con_itbis:
 *           type: boolean
 *           description: Indica si el producto tiene ITBIS
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría del producto
 *         imagen:
 *           type: string
 *           description: URL de la imagen del producto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto
 *         is_active:
 *           type: boolean
 *           description: Estado del producto (activo/inactivo)
 *         categoria_nombre:
 *           type: string
 *           description: Nombre de la categoría del producto
 *         ganancia_unitaria:
 *           type: string
 *           format: float
 *           description: Diferencia entre precio de venta y precio de compra
 *         margen_ganancia:
 *           type: string
 *           format: float
 *           description: Porcentaje de ganancia. Si precio_compra es 0, el margen será 0
 *       example:
 *         id: 1
 *         nombre: "Cerveza Presidente"
 *         precio: "175.00"
 *         precio_compra: "140.00"
 *         stock: 100
 *         con_itbis: true
 *         categoria_id: 1
 *         imagen: "imagen-123456789.jpg"
 *         descripcion: "Cerveza Presidente grande"
 *         is_active: true
 *         categoria_nombre: "Cervezas"
 *         ganancia_unitaria: "35.00"
 *         margen_ganancia: "25.00"
 * 
 *     ProductoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - precio_compra
 *         - stock
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         precio:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Precio de venta del producto
 *         precio_compra:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Precio de compra del producto (debe ser menor que el precio de venta)
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: Cantidad disponible en inventario
 *         con_itbis:
 *           type: boolean
 *           description: Indica si el producto tiene ITBIS
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría del producto
 *         imagen:
 *           type: string
 *           description: URL de la imagen del producto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto
 *         is_active:
 *           type: boolean
 *           description: Estado del producto (activo/inactivo)
 *       example:
 *         nombre: "Cerveza Presidente"
 *         precio: 175.00
 *         precio_compra: 140.00
 *         stock: 100
 *         con_itbis: true
 *         categoria_id: 1
 *         imagen: "imagen-123456789.jpg"
 *         descripcion: "Cerveza Presidente grande"
 *         is_active: true
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener lista de productos
 *     tags: [Productos]
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
 *           maximum: 100
 *           default: 10
 *         description: Tamaño de página
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Buscar por nombre
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
 *                     $ref: '#/components/schemas/Producto'
 *                 page:
 *                   type: integer
 *                   description: Página actual
 *                 size:
 *                   type: integer
 *                   description: Tamaño de página
 *                 totalElements:
 *                   type: integer
 *                   description: Total de elementos
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 categoria_id:
 *                   type: integer
 *                   nullable: true
 *                   description: ID de categoría filtrado
 *                 buscar:
 *                   type: string
 *                   nullable: true
 *                   description: Término de búsqueda
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
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
 *                   example: ["El nombre es obligatorio", "El precio debe ser un número positivo", "El precio de compra debe ser menor que el precio de venta"]
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 * 
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Producto'
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
 *                   example: ["El nombre es obligatorio", "El precio debe ser un número positivo", "El precio de compra debe ser menor que el precio de venta"]
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 * 
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
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
 *                   example: "Producto eliminado exitosamente"
 *       401:
 *         description: No autorizado
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
