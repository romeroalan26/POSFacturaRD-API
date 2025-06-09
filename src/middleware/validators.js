const { body, param, validationResult } = require('express-validator');

// Middleware para manejar los resultados de la validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Validaciones para usuarios
const userValidators = {
    register: [
        body('email')
            .isEmail()
            .withMessage('El email debe ser válido')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es requerido')
            .isLength({ max: 100 })
            .withMessage('El nombre no puede tener más de 100 caracteres'),
        validate
    ],
    login: [
        body('email')
            .isEmail()
            .withMessage('El email debe ser válido')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('La contraseña es requerida'),
        validate
    ],
    updateRole: [
        param('userId')
            .isInt()
            .withMessage('ID de usuario inválido'),
        body('role_id')
            .isInt()
            .withMessage('ID de rol inválido'),
        validate
    ]
};

// Validaciones para productos
const productValidators = {
    create: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es requerido')
            .isLength({ max: 100 })
            .withMessage('El nombre no puede tener más de 100 caracteres'),
        body('precio')
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número positivo'),
        body('stock')
            .isInt({ min: 0 })
            .withMessage('El stock debe ser un número entero positivo'),
        body('itbis')
            .isBoolean()
            .withMessage('ITBIS debe ser true o false'),
        validate
    ],
    update: [
        param('id')
            .isInt()
            .withMessage('ID de producto inválido'),
        body('nombre')
            .optional()
            .isLength({ max: 100 })
            .withMessage('El nombre no puede tener más de 100 caracteres'),
        body('precio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número positivo'),
        body('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('El stock debe ser un número entero positivo'),
        body('itbis')
            .optional()
            .isBoolean()
            .withMessage('ITBIS debe ser true o false'),
        validate
    ]
};

// Validaciones para ventas
const saleValidators = {
    create: [
        body('productos')
            .isArray()
            .withMessage('Debe proporcionar un array de productos')
            .notEmpty()
            .withMessage('La venta debe tener al menos un producto'),
        body('productos.*.producto_id')
            .isInt()
            .withMessage('ID de producto inválido'),
        body('productos.*.cantidad')
            .isInt({ min: 1 })
            .withMessage('La cantidad debe ser un número entero positivo'),
        body('metodo_pago')
            .isIn(['efectivo', 'tarjeta', 'transferencia'])
            .withMessage('Método de pago inválido'),
        validate
    ]
};

module.exports = {
    userValidators,
    productValidators,
    saleValidators
}; 