/**
 * @swagger
 * tags:
 *   name: Gastos
 *   description: API para gestionar los gastos
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
 *     Gasto:
 *       type: object
 *       required:
 *         - monto
 *         - descripcion
 *         - categoria_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del gasto
 *         monto:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Monto del gasto
 *         descripcion:
 *           type: string
 *           description: Descripción del gasto
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría del gasto
 *         categoria_nombre:
 *           type: string
 *           description: Nombre de la categoría del gasto
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha del gasto
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *       example:
 *         id: 1
 *         monto: 1000.00
 *         descripcion: "Compra de suministros"
 *         categoria_id: 1
 *         categoria_nombre: "Suministros"
 *         fecha: "2024-02-13T02:46:07"
 *         usuario:
 *           id: 1
 *           nombre: "Juan Pérez"
 *           email: "juan@example.com"
 * 
 *     GastoInput:
 *       type: object
 *       required:
 *         - monto
 *         - descripcion
 *         - categoria_id
 *       properties:
 *         monto:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Monto del gasto
 *         descripcion:
 *           type: string
 *           description: Descripción del gasto
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría del gasto
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha del gasto (opcional, por defecto es la fecha actual)
 *       example:
 *         monto: 1000.00
 *         descripcion: "Compra de suministros"
 *         categoria_id: 1
 *         fecha: "2024-02-13T02:46:07"
 */

/**
 * @swagger
 * /api/gastos:
 *   get:
 *     summary: Obtiene todos los gastos
 *     description: Retorna una lista paginada de gastos con información del usuario que los registró
 *     tags: [Gastos]
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
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: ID de la categoría para filtrar
 *       - in: query
 *         name: descripcion
 *         schema:
 *           type: string
 *         description: Texto para buscar en la descripción del gasto (búsqueda parcial)
 *     responses:
 *       200:
 *         description: Lista de gastos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gasto'
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
 * 
 *   post:
 *     summary: Crea un nuevo gasto
 *     description: Registra un nuevo gasto con la información del usuario que lo registra
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GastoInput'
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Gasto'
 *                 mensaje:
 *                   type: string
 *                   example: "Gasto registrado exitosamente"
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
 *                   example: ["Monto, descripción y categoría son requeridos"]
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/gastos/{id}:
 *   get:
 *     tags:
 *       - Gastos
 *     summary: Obtener un gasto específico
 *     description: Retorna los detalles de un gasto por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del gasto
 *     responses:
 *       200:
 *         description: Gasto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Gasto'
 *       404:
 *         description: Gasto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/gastos/{id}:
 *   put:
 *     tags:
 *       - Gastos
 *     summary: Actualizar un gasto
 *     description: Actualiza los datos de un gasto existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del gasto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - descripcion
 *               - monto
 *               - categoria_id
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del gasto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del gasto
 *               monto:
 *                 type: number
 *                 description: Monto del gasto
 *               categoria_id:
 *                 type: integer
 *                 description: ID de la categoría del gasto
 *     responses:
 *       200:
 *         description: Gasto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Gasto'
 *                 mensaje:
 *                   type: string
 *                   example: Gasto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/gastos/{id}:
 *   delete:
 *     tags:
 *       - Gastos
 *     summary: Eliminar un gasto
 *     description: Elimina un registro de gasto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del gasto
 *     responses:
 *       200:
 *         description: Gasto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Gasto eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/gastos/exportar/csv:
 *   get:
 *     summary: Exportar gastos a CSV
 *     description: Exporta los gastos a un archivo CSV con filtros opcionales
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: ID de la categoría para filtrar
 *     responses:
 *       200:
 *         description: Archivo CSV generado exitosamente
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /api/gastos/exportar/pdf:
 *   get:
 *     summary: Exportar gastos a PDF
 *     description: Exporta los gastos a un archivo PDF con filtros opcionales
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar (YYYY-MM-DD)
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: ID de la categoría para filtrar
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */ 