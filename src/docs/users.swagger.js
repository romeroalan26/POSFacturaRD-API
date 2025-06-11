/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestionar usuarios y sus roles
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener lista de usuarios
 *     description: Retorna la lista de todos los usuarios registrados. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     example: "Juan Pérez"
 *                   email:
 *                     type: string
 *                     example: "juan@example.com"
 *                   role_id:
 *                     type: integer
 *                     example: 2
 *                   role_nombre:
 *                     type: string
 *                     example: "cajero"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver usuarios
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al obtener usuarios"
 */

/**
 * @swagger
 * /api/usuarios/{userId}/role:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar rol de usuario
 *     description: Actualiza el rol de un usuario específico. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *             properties:
 *               role_id:
 *                 type: integer
 *                 description: ID del nuevo rol
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Rol actualizado exitosamente"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     email:
 *                       type: string
 *                       example: "juan@example.com"
 *                     role_id:
 *                       type: integer
 *                       example: 2
 *                     role_nombre:
 *                       type: string
 *                       example: "cajero"
 *       400:
 *         description: El rol especificado no existe
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para actualizar roles
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al actualizar rol del usuario"
 */

/**
 * @swagger
 * /api/usuarios/{userId}/permissions:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener permisos de usuario
 *     description: Retorna los permisos asociados al rol del usuario. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Permisos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permisos:
 *                   type: object
 *                   properties:
 *                     productos:
 *                       type: object
 *                       properties:
 *                         view:
 *                           type: boolean
 *                           example: true
 *                         create:
 *                           type: boolean
 *                           example: false
 *                         update:
 *                           type: boolean
 *                           example: false
 *                         delete:
 *                           type: boolean
 *                           example: false
 *                     ventas:
 *                       type: object
 *                       properties:
 *                         view:
 *                           type: boolean
 *                           example: true
 *                         create:
 *                           type: boolean
 *                           example: true
 *                     reportes:
 *                       type: object
 *                       properties:
 *                         view:
 *                           type: boolean
 *                           example: true
 *                     users:
 *                       type: object
 *                       properties:
 *                         view:
 *                           type: boolean
 *                           example: false
 *                         update:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para ver permisos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al obtener permisos del usuario"
 */

/**
 * @swagger
 * /api/usuarios/{userId}/reset-password:
 *   put:
 *     tags: [Usuarios]
 *     summary: Reiniciar contraseña de usuario
 *     description: Actualiza la contraseña de un usuario específico. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña del usuario
 *                 example: "nuevaContraseña123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para actualizar contraseñas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error al actualizar la contraseña del usuario"
 */ 