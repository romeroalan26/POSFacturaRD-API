/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API para generar reportes del sistema
 */

/**
 * @swagger
 * /api/reportes/ventas-diarias:
 *   get:
 *     summary: Obtiene el reporte de ventas diarias
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
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
 *     responses:
 *       200:
 *         description: Reporte de ventas diarias
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
 *                       dia:
 *                         type: string
 *                         format: date
 *                       total_ventas:
 *                         type: integer
 *                       total_monto:
 *                         type: number
 *                         format: float
 *                 page:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/productos-mas-vendidos:
 *   get:
 *     summary: Obtiene los productos más vendidos en un período
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de categoría
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
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
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
 *                       categoria:
 *                         type: string
 *                       total_vendido:
 *                         type: integer
 *                       total_ingresos:
 *                         type: number
 *                         format: float
 *                       ganancia_total:
 *                         type: number
 *                         format: float
 *                         description: Ganancia total del producto
 *                       ganancia_unitaria:
 *                         type: number
 *                         format: float
 *                         description: Ganancia promedio por unidad
 *                       margen_ganancia:
 *                         type: number
 *                         format: float
 *                         description: Porcentaje de margen de ganancia
 *                       total_ventas:
 *                         type: integer
 *                 page:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                 categoria:
 *                   type: string
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/resumen-metodo-pago:
 *   get:
 *     summary: Obtiene el resumen de ventas por método de pago
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
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
 *     responses:
 *       200:
 *         description: Resumen de ventas por método de pago
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
 *                       metodo_pago:
 *                         type: string
 *                       total_ventas:
 *                         type: integer
 *                       total_monto:
 *                         type: number
 *                         format: float
 *                       promedio_venta:
 *                         type: number
 *                         format: float
 *                       venta_minima:
 *                         type: number
 *                         format: float
 *                       venta_maxima:
 *                         type: number
 *                         format: float
 *                 page:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/resumen-general:
 *   get:
 *     summary: Obtiene el resumen general de ventas
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Resumen general de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_ventas:
 *                       type: integer
 *                     total_ingresos:
 *                       type: number
 *                       format: float
 *                     promedio_venta:
 *                       type: number
 *                       format: float
 *                     dias_con_ventas:
 *                       type: integer
 *                     total_productos_vendidos:
 *                       type: integer
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/ventas-por-hora:
 *   get:
 *     summary: Obtiene el reporte de ventas por hora
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Reporte de ventas por hora
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
 *                       hora:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 23
 *                       total_ventas:
 *                         type: integer
 *                       total_monto:
 *                         type: number
 *                         format: float
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/tendencia-ventas:
 *   get:
 *     summary: Obtiene la tendencia de ventas
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
 *       - in: query
 *         name: intervalo
 *         schema:
 *           type: string
 *           enum: [hora, dia, semana, mes]
 *           default: dia
 *         description: Intervalo de tiempo para agrupar los datos
 *     responses:
 *       200:
 *         description: Tendencia de ventas
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
 *                       periodo:
 *                         type: string
 *                       total_ventas:
 *                         type: integer
 *                       total_monto:
 *                         type: number
 *                         format: float
 *                       promedio_venta:
 *                         type: number
 *                         format: float
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                 intervalo:
 *                   type: string
 *                   enum: [hora, dia, semana, mes]
 *       400:
 *         description: Error de validación en los parámetros
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/productos-bajo-stock:
 *   get:
 *     summary: Obtiene los productos cuyo stock actual es igual o menor a su stock mínimo
 *     description: |
 *       Retorna una lista de productos que necesitan reposición, ordenados por prioridad.
 *       Un producto aparece en la lista cuando su stock actual es menor o igual a su stock mínimo definido.
 *       Los resultados se ordenan primero por la diferencia entre stock mínimo y stock actual (mayor diferencia primero),
 *       y luego por el stock actual (menor stock primero).
 *     tags: [Reportes]
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
 *     responses:
 *       200:
 *         description: Lista de productos con bajo stock
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
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Producto A"
 *                       stock:
 *                         type: integer
 *                         example: 5
 *                       stock_minimo:
 *                         type: integer
 *                         example: 10
 *                       precio:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       precio_compra:
 *                         type: number
 *                         format: float
 *                         example: 100.00
 *                       categoria:
 *                         type: string
 *                         example: "Categoría 1"
 *                       total_vendido_mes:
 *                         type: integer
 *                         example: 25
 *                       diferencia_stock:
 *                         type: integer
 *                         example: 5
 *                         description: Diferencia entre stock mínimo y stock actual (stock_minimo - stock)
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 size:
 *                   type: integer
 *                   example: 10
 *                 totalElements:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/ganancias:
 *   get:
 *     summary: Obtiene el reporte de ganancias por producto
 *     description: Retorna un reporte detallado de ganancias por producto con resumen general
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del reporte (YYYY-MM-DD)
 *       - in: query
 *         name: producto_id
 *         schema:
 *           type: integer
 *         description: ID del producto para filtrar (opcional)
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
 *     responses:
 *       200:
 *         description: Reporte de ganancias obtenido exitosamente
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
 *                       producto_id:
 *                         type: integer
 *                         example: 1
 *                       nombre_producto:
 *                         type: string
 *                         example: "Producto A"
 *                       categoria:
 *                         type: string
 *                         example: "Categoría 1"
 *                       cantidad_vendida:
 *                         type: integer
 *                         example: 10
 *                       precio_compra:
 *                         type: number
 *                         format: float
 *                         example: 100.00
 *                       precio_venta:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       ganancia_unitaria:
 *                         type: number
 *                         format: float
 *                         example: 50.00
 *                       ganancia_total:
 *                         type: number
 *                         format: float
 *                         example: 500.00
 *                 resumen:
 *                   type: object
 *                   properties:
 *                     total_productos_vendidos:
 *                       type: integer
 *                       example: 100
 *                     total_ventas:
 *                       type: number
 *                       format: float
 *                       example: 15000.00
 *                     total_costos:
 *                       type: number
 *                       format: float
 *                       example: 10000.00
 *                     total_ganancias:
 *                       type: number
 *                       format: float
 *                       example: 5000.00
 *                     margen_promedio:
 *                       type: number
 *                       format: float
 *                       example: 50.00
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 size:
 *                   type: integer
 *                   example: 10
 *                 totalElements:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-01"
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-31"
 *                 producto_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Error de validación en los parámetros
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
 *                   example: ["La fecha de inicio es requerida"]
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/ventas-por-categoria:
 *   get:
 *     summary: Obtiene el reporte de ventas agrupadas por categoría
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del período (YYYY-MM-DD)
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
 *     responses:
 *       200:
 *         description: Reporte de ventas por categoría
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
 *                       categoria_id:
 *                         type: integer
 *                       categoria:
 *                         type: string
 *                       total_ventas:
 *                         type: integer
 *                       total_productos_vendidos:
 *                         type: integer
 *                       total_ingresos:
 *                         type: number
 *                         format: float
 *                       precio_promedio:
 *                         type: number
 *                         format: float
 *                       ganancia_total:
 *                         type: number
 *                         format: float
 *                       margen_ganancia:
 *                         type: number
 *                         format: float
 *                 page:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                 fecha_fin:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Error de validación en los parámetros
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/reportes/gastos:
 *   get:
 *     summary: Obtiene un reporte detallado de gastos con KPIs
 *     description: Retorna un reporte completo de gastos incluyendo KPIs generales, por categoría, por mes, por usuario y tendencias
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del reporte (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del reporte (YYYY-MM-DD)
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: ID de la categoría para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Reporte de gastos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     kpis_generales:
 *                       type: object
 *                       properties:
 *                         total_gastos:
 *                           type: integer
 *                           example: 150
 *                         total_monto:
 *                           type: number
 *                           format: float
 *                           example: 50000.00
 *                         promedio_gasto:
 *                           type: number
 *                           format: float
 *                           example: 333.33
 *                         gasto_maximo:
 *                           type: number
 *                           format: float
 *                           example: 1000.00
 *                         gasto_minimo:
 *                           type: number
 *                           format: float
 *                           example: 50.00
 *                         variacion_mensual:
 *                           type: number
 *                           format: float
 *                           example: 5.25
 *                     gastos_por_categoria:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoria_nombre:
 *                             type: string
 *                             example: "Servicios"
 *                           cantidad:
 *                             type: integer
 *                             example: 45
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 15000.00
 *                           porcentaje:
 *                             type: number
 *                             format: float
 *                             example: 30.00
 *                     gastos_por_mes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mes:
 *                             type: string
 *                             example: "2024-01"
 *                           cantidad:
 *                             type: integer
 *                             example: 25
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 8500.00
 *                     gastos_por_usuario:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           usuario_nombre:
 *                             type: string
 *                             example: "Juan Pérez"
 *                           cantidad:
 *                             type: integer
 *                             example: 30
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 10000.00
 *                     tendencia_gastos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dia:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                           total:
 *                             type: number
 *                             format: float
 *                             example: 500.00
 *                     periodo:
 *                       type: object
 *                       properties:
 *                         fecha_inicio:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-01"
 *                         fecha_fin:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-31"
 *                         categoria_id:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: Error de validación en los parámetros
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
 *                   example: ["La fecha de inicio es requerida"]
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
