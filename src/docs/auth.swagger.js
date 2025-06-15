/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         role:
 *           type: string
 *           enum: [admin, cajero, inventario, invitado]
 *           description: Rol del usuario en el sistema
 *         permissions:
 *           type: object
 *           description: Permisos del usuario basados en su rol
 *           properties:
 *             products:
 *               type: object
 *               properties:
 *                 view: { type: boolean }
 *                 create: { type: boolean }
 *                 update: { type: boolean }
 *                 delete: { type: boolean }
 *             sales:
 *               type: object
 *               properties:
 *                 view: { type: boolean }
 *                 create: { type: boolean }
 *                 update: { type: boolean }
 *                 delete: { type: boolean }
 *             reports:
 *               type: object
 *               properties:
 *                 view: { type: boolean }
 *                 export: { type: boolean }
 *             users:
 *               type: object
 *               properties:
 *                 view: { type: boolean }
 *                 create: { type: boolean }
 *                 update: { type: boolean }
 *                 delete: { type: boolean }
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: Token JWT para autenticación
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - nombre
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token para autenticación
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     description: Autentica a un usuario y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
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
 *                   example: ["El email es requerido", "La contraseña es requerida"]
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       500:
 *         description: Error del servidor
 * 
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
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
 *                   example: ["El email ya está registrado", "La contraseña debe tener al menos 6 caracteres"]
 *       500:
 *         description: Error del servidor
 */ 