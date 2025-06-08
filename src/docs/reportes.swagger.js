/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API para obtener reportes del sistema
 */

/**
 * @swagger
 * /api/reportes/ventas-diarias:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener reporte de ventas diarias
 *     description: Retorna un reporte de ventas agrupadas por día. Todos los roles pueden ver.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para el reporte (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     example: "2024-03-15"
 *                   total_ventas:
 *                     type: number
 *                     example: 1500.00
 *                   cantidad_ventas:
 *                     type: integer
 *                     example: 10
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver reportes
 *       400:
 *         description: Error en los parámetros
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
 *                     "Formato de fecha inicio inválido. Use YYYY-MM-DD",
 *                     "La fecha de inicio debe ser anterior a la fecha de fin"
 *                   ]
 */

/**
 * @swagger
 * /api/reportes/productos-mas-vendidos:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener reporte de productos más vendidos
 *     description: Retorna un reporte de los productos más vendidos. Todos los roles pueden ver.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Cantidad de productos a mostrar
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
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
 *                   total_vendido:
 *                     type: integer
 *                     example: 50
 *                   total_ingresos:
 *                     type: number
 *                     example: 11250.00
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver reportes
 *       400:
 *         description: Error en los parámetros
 */

/**
 * @swagger
 * /api/reportes/resumen-metodo-pago:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener resumen por método de pago
 *     description: Retorna un resumen de ventas agrupadas por método de pago. Todos los roles pueden ver.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para el reporte (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   metodo_pago:
 *                     type: string
 *                     enum: [efectivo, tarjeta, transferencia]
 *                     example: efectivo
 *                   total_ventas:
 *                     type: number
 *                     example: 5000.00
 *                   cantidad_ventas:
 *                     type: integer
 *                     example: 25
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver reportes
 *       400:
 *         description: Error en los parámetros
 */
