/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para gestionar las ventas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *       example:
 *         id: 1
 *         nombre: "Juan Pérez"
 *         email: "juan@example.com"
 * 
 *     VentaProducto:
 *       type: object
 *       required:
 *         - producto_id
 *         - cantidad
 *         - precio_unitario
 *         - precio_compra
 *       properties:
 *         producto_id:
 *           type: integer
 *           description: ID del producto
 *         nombre_producto:
 *           type: string
 *           description: Nombre del producto
 *         categoria_nombre:
 *           type: string
 *           description: Nombre de la categoría del producto
 *         cantidad:
 *           type: integer
 *           minimum: 1
 *           description: Cantidad vendida
 *         precio_unitario:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Precio de venta unitario
 *         precio_compra:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Precio de compra unitario
 *         ganancia_unitaria:
 *           type: number
 *           format: float
 *           description: Diferencia entre precio_unitario y precio_compra (redondeado a 2 decimales)
 *         ganancia_total:
 *           type: number
 *           format: float
 *           description: Ganancia total (ganancia_unitaria * cantidad) (redondeado a 2 decimales)
 *         margen_ganancia:
 *           type: number
 *           format: float
 *           description: Porcentaje de ganancia ((precio_unitario - precio_compra) / precio_compra * 100) (redondeado a 2 decimales)
 *       example:
 *         producto_id: 1
 *         nombre_producto: "Coca Cola 2L"
 *         categoria_nombre: "Bebidas"
 *         cantidad: 2
 *         precio_unitario: 175.00
 *         precio_compra: 140.00
 *         ganancia_unitaria: 35.00
 *         ganancia_total: 70.00
 *         margen_ganancia: 25.00
 * 
 *     Venta:
 *       type: object
 *       required:
 *         - productos
 *         - metodo_pago
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la venta
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la venta
 *         total:
 *           type: number
 *           format: float
 *           description: Total de la venta
 *         metodo_pago:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *           description: Método de pago utilizado
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal de la venta
 *         itbis_total:
 *           type: number
 *           format: float
 *           description: Total de ITBIS
 *         total_final:
 *           type: number
 *           format: float
 *           description: Total final incluyendo ITBIS
 *         productos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VentaProducto'
 *         ganancia_total_venta:
 *           type: number
 *           format: float
 *           description: Suma total de ganancias de todos los productos (redondeado a 2 decimales)
 *         margen_promedio:
 *           type: number
 *           format: float
 *           description: Promedio de márgenes de ganancia de todos los productos (redondeado a 2 decimales)
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *       example:
 *         id: 1
 *         fecha: "2024-02-13T02:46:07"
 *         total: 350.00
 *         metodo_pago: "efectivo"
 *         subtotal: 350.00
 *         itbis_total: 0.00
 *         total_final: 350.00
 *         productos: [
 *           {
 *             producto_id: 1,
 *             cantidad: 2,
 *             precio_unitario: 175.00,
 *             precio_compra: 140.00,
 *             ganancia_unitaria: 35.00,
 *             ganancia_total: 70.00,
 *             margen_ganancia: 25.00
 *           }
 *         ]
 *         ganancia_total_venta: 70.00
 *         margen_promedio: 25.00
 *         usuario: {
 *           id: 1,
 *           nombre: "Juan Pérez",
 *           email: "juan@example.com"
 *         }
 * 
 *     VentaInput:
 *       type: object
 *       required:
 *         - productos
 *         - metodo_pago
 *       properties:
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *                 description: Cantidad a vender
 *         metodo_pago:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *           description: Método de pago
 *       example:
 *         productos: [
 *           {
 *             producto_id: 1,
 *             cantidad: 2
 *           }
 *         ]
 *         metodo_pago: "efectivo"
 */

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener lista de ventas
 *     tags: [Ventas]
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
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar ventas
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar ventas
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *         description: Filtrar por método de pago
 *     responses:
 *       200:
 *         description: Lista de ventas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venta'
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
 *                 ganancia_total_periodo:
 *                   type: number
 *                   format: float
 *                   description: Suma total de ganancias en el período (redondeado a 2 decimales)
 *                 margen_promedio_periodo:
 *                   type: number
 *                   format: float
 *                   description: Promedio de márgenes de ganancia en el período (redondeado a 2 decimales)
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VentaInput'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *                 mensaje:
 *                   type: string
 *                   example: "Venta registrada exitosamente"
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
 *                   example: ["Stock insuficiente", "Producto no encontrado"]
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Venta'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 * 
 *   delete:
 *     summary: Eliminar/cancelar una venta
 *     description: Elimina una venta y devuelve el stock de los productos. Solo disponible para administradores.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a eliminar
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Venta eliminada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     venta:
 *                       $ref: '#/components/schemas/Venta'
 *                     productos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VentaProducto'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos para eliminar ventas
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/ventas/exportar:
 *   get:
 *     summary: Exportar lista de ventas a CSV
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar ventas
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar ventas
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *         description: Filtrar por método de pago
 *     responses:
 *       200:
 *         description: Archivo CSV con la lista de ventas
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "ID,Fecha,Usuario,Método de Pago,Subtotal,ITBIS,Total,Ganancia Total,Margen Promedio,Productos"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
