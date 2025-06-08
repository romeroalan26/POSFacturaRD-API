/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Registro de ventas y productos vendidos
 */

/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_pago:
 *                 type: string
 *                 example: "efectivo"
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                     precio_unitario:
 *                       type: number
 *                       example: 150
 *     responses:
 *       201:
 *         description: Venta registrada
 */
/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener listado de ventas registradas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fecha:
 *                     type: string
 *                   total:
 *                     type: number
 *                   metodo_pago:
 *                     type: string
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         producto_id:
 *                           type: integer
 *                         cantidad:
 *                           type: integer
 *                         precio_unitario:
 *                           type: number
 */
