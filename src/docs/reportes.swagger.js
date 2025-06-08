/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API para generar reportes y estadísticas del sistema
 */

/**
 * @swagger
 * /reportes/diario:
 *   get:
 *     summary: Reporte de ventas agrupadas por día
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Fecha de inicio para filtrar el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         description: Fecha de fin para filtrar el reporte (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de ventas diarias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dia:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-01"
 *                   total_ventas:
 *                     type: integer
 *                     description: Número total de ventas en el día
 *                     example: 15
 *                   total_monto:
 *                     type: number
 *                     description: Monto total vendido en el día
 *                     example: 3750.00
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
 *                     "Formato de fecha inválido",
 *                     "La fecha de inicio debe ser anterior a la fecha de fin",
 *                     "La fecha de inicio es obligatoria",
 *                     "La fecha de fin es obligatoria"
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
 *                   example: Error al generar el reporte diario
 */

/**
 * @swagger
 * /reportes/productos:
 *   get:
 *     summary: Obtener productos más vendidos
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Fecha de inicio para filtrar el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         description: Fecha de fin para filtrar el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número máximo de productos a mostrar
 *     responses:
 *       200:
 *         description: Ranking de productos por cantidad vendida obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del producto
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto
 *                     example: "Producto A"
 *                   total_vendido:
 *                     type: integer
 *                     description: Cantidad total vendida
 *                     example: 150
 *                   total_ingresos:
 *                     type: number
 *                     description: Monto total generado por el producto
 *                     example: 33750.00
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
 *                     "Formato de fecha inválido",
 *                     "La fecha de inicio debe ser anterior a la fecha de fin",
 *                     "El límite debe ser un número entre 1 y 100",
 *                     "La fecha de inicio es obligatoria",
 *                     "La fecha de fin es obligatoria"
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
 *                   example: Error al generar el reporte de productos
 */

/**
 * @swagger
 * /reportes/metodos-pago:
 *   get:
 *     summary: Obtener resumen de ventas por método de pago
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Fecha de inicio para filtrar el reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         description: Fecha de fin para filtrar el reporte (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Resumen de ventas por método de pago obtenido exitosamente
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
 *                     description: Método de pago utilizado
 *                     example: efectivo
 *                   total_ventas:
 *                     type: integer
 *                     description: Número total de ventas con este método
 *                     example: 45
 *                   total_monto:
 *                     type: number
 *                     description: Monto total vendido con este método
 *                     example: 11250.00
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
 *                     "Formato de fecha inválido",
 *                     "La fecha de inicio debe ser anterior a la fecha de fin",
 *                     "La fecha de inicio es obligatoria",
 *                     "La fecha de fin es obligatoria"
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
 *                   example: Error al generar el reporte de métodos de pago
 */
