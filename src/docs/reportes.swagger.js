/**
 * @swagger
 * /reportes/diario:
 *   get:
 *     summary: Reporte de ventas agrupadas por día
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Lista de ventas diarias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dia:
 *                     type: string
 *                   total_ventas:
 *                     type: integer
 *                   total_monto:
 *                     type: number
 */
/**
 * @swagger
 * /reportes/productos:
 *   get:
 *     summary: Obtener productos más vendidos
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Ranking de productos por cantidad vendida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   total_vendido:
 *                     type: integer
 *                   total_ingresos:
 *                     type: number
 */
/**
 * @swagger
 * /reportes/metodos-pago:
 *   get:
 *     summary: Obtener resumen de ventas por método de pago
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Monto total vendido por tipo de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   metodo_pago:
 *                     type: string
 *                   total_ventas:
 *                     type: integer
 *                   total_monto:
 *                     type: number
 */
