const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const register = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Obtener el rol por defecto (cajero)
        const defaultRole = await pool.query(
            'SELECT id FROM roles WHERE name = $1',
            ['cajero']
        );

        if (defaultRole.rows.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error: No se encontró el rol por defecto'
            });
        }

        // Crear usuario con rol
        const newUser = await pool.query(
            'INSERT INTO usuarios (email, password, nombre, role_id) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre',
            [email, hashedPassword, nombre, defaultRole.rows[0].id]
        );

        const token = generateToken(newUser.rows[0]);

        res.status(201).json({
            success: true,
            data: {
                user: newUser.rows[0],
                token
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe y obtener su rol
        const user = await pool.query(
            `SELECT u.*, r.name as role_name, r.permissions 
             FROM usuarios u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = $1`,
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const token = generateToken(user.rows[0]);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.rows[0].id,
                    email: user.rows[0].email,
                    nombre: user.rows[0].nombre,
                    role: user.rows[0].role_name,
                    permissions: user.rows[0].permissions
                },
                token
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

module.exports = {
    register,
    login
}; 