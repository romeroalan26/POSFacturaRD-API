/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para gestionar las ventas
 */

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     tags: [Ventas]
 *     summary: Registrar una nueva venta
 *     description: |
 *       Registra una nueva venta con sus productos asociados. Requiere rol de admin o cajero.
 *       El ITBIS se calcula automáticamente según la configuración del sistema (por defecto 18%).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metodo_pago
 *               - productos
 *             properties:
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, tarjeta, transferencia]
 *                 description: Método de pago de la venta
 *                 example: efectivo
 *               productos:
 *                 type: array
 *                 description: Lista de productos en la venta
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto_id
 *                     - cantidad
 *                     - precio_unitario
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                       description: ID del producto
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       minimum: 1
 *                       description: Cantidad de unidades
 *                       example: 2
 *                     precio_unitario:
 *                       type: number
 *                       minimum: 0.01
 *                       description: Precio unitario del producto (debe coincidir con el precio actual)
 *                       example: 225.00
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Venta registrada
 *                 venta_id:
 *                   type: integer
 *                   example: 1
 *                 subtotal:
 *                   type: number
 *                   description: Suma total de los productos antes del ITBIS
 *                   example: 1150.00
 *                 itbis_total:
 *                   type: number
 *                   description: Monto total del ITBIS calculado
 *                   example: 207.00
 *                 total_final:
 *                   type: number
 *                   description: Monto total a pagar (subtotal + ITBIS)
 *                   example: 1357.00
 *                 itbis_rate:
 *                   type: number
 *                   description: Tasa de ITBIS aplicada (configurable en .env)
 *                   example: 0.18
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
 *                     "Stock insuficiente para el producto Producto A. Stock disponible: 5",
 *                     "El precio del producto \"Producto B\" ha cambiado. Precio actual: 250.00, Precio enviado: 225.00",
 *                     "El producto con ID 3 no existe",
 *                     "Método de pago inválido. Debe ser uno de: efectivo, tarjeta, transferencia"
 *                   ]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para registrar ventas
 *   get:
 *     tags: [Ventas]
 *     summary: Obtener lista de ventas
 *     description: Retorna una lista paginada de ventas con opciones de filtrado. Todos los roles pueden ver.
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
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar ventas (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar ventas (YYYY-MM-DD)
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *         description: Método de pago para filtrar ventas
 *     responses:
 *       200:
 *         description: Lista de ventas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ventas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-15T14:30:00Z"
 *                       subtotal:
 *                         type: number
 *                         description: Suma total de los productos antes del ITBIS
 *                         example: 1150.00
 *                       itbis_total:
 *                         type: number
 *                         description: Monto total del ITBIS calculado
 *                         example: 207.00
 *                       total_final:
 *                         type: number
 *                         description: Monto total a pagar (subtotal + ITBIS)
 *                         example: 1357.00
 *                       metodo_pago:
 *                         type: string
 *                         example: efectivo
 *                       productos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             producto_id:
 *                               type: integer
 *                               example: 1
 *                             cantidad:
 *                               type: integer
 *                               example: 2
 *                             precio_unitario:
 *                               type: number
 *                               example: 225.00
 *                             subtotal_producto:
 *                               type: number
 *                               description: Subtotal del producto (cantidad × precio_unitario)
 *                               example: 450.00
 *                 paginacion:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     pagina_actual:
 *                       type: integer
 *                       example: 1
 *                     total_paginas:
 *                       type: integer
 *                       example: 5
 *                     registros_por_pagina:
 *                       type: integer
 *                       example: 10
 *                 subtotal:
 *                   type: number
 *                   example: 400.00
 *                 itbis_total:
 *                   type: number
 *                   example: 72.00
 *                 total_final:
 *                   type: number
 *                   example: 472.00
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver ventas
 */
