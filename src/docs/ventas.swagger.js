/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para gestionar las ventas
 */

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtiene la lista de ventas
 *     tags: [Ventas]
 *     description: Retorna la lista de ventas con paginación y filtros
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
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: metodo_pago
 *         schema:
 *           type: string
 *           enum: [efectivo, tarjeta, transferencia]
 *         description: Método de pago
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                       total:
 *                         type: string
 *                         format: float
 *                       metodo_pago:
 *                         type: string
 *                         enum: [efectivo, tarjeta, transferencia]
 *                       productos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             producto_id:
 *                               type: integer
 *                             cantidad:
 *                               type: integer
 *                             precio_unitario:
 *                               type: number
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 size:
 *                   type: integer
 *                   example: 10
 *                 totalElements:
 *                   type: integer
 *                   example: 11
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                 metodo_pago:
 *                   type: string
 *                   enum: [efectivo, tarjeta, transferencia]
 *                   nullable: true
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver ventas
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Registrar una venta
 *     tags: [Ventas]
 *     description: Registra una nueva venta en el sistema POS.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productos
 *               - metodo_pago
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               metodo_pago:
 *                 type: string
 *                 enum: [efectivo, tarjeta, transferencia]
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 mensaje:
 *                   type: string
 *                   example: Venta registrada exitosamente
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Stock insuficiente para el producto Presidente Jumbo. Stock disponible: 24, solicitado: 31
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Stock insuficiente para el producto Presidente Jumbo. Stock disponible: 24, solicitado: 31"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para registrar ventas
 *       500:
 *         description: Error del servidor
 */
