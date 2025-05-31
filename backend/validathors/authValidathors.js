const { body, validationResult } = require('express-validator');

// Validador para registro
const validateRegister = [
    body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos')
        .toLowerCase(),

    body('email')
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede tener más de 100 caracteres'),

    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('La contraseña debe tener entre 6 y 128 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

// Validador para login
const validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('El nombre de usuario es requerido')
        .isLength({ max: 50 })
        .withMessage('El nombre de usuario no puede tener más de 50 caracteres')
        .toLowerCase(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ max: 128 })
        .withMessage('La contraseña es demasiado larga')
];

// Validador para cambio de contraseña
const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es requerida'),

    body('newPassword')
        .isLength({ min: 6, max: 128 })
        .withMessage('La nueva contraseña debe tener entre 6 y 128 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),

    body('confirmNewPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

// Validador para actualización de perfil
const validateUpdateProfile = [
    body('username')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos')
        .toLowerCase(),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede tener más de 100 caracteres')
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));

        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errorMessages
        });
    }
    
    next();
};

// Validador personalizado para verificar si el usuario existe
const checkUserExists = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const { username, email } = req.body;

        if (username) {
            const existingUsername = await User.usernameExists(username);
            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }
        }

        if (email) {
            const existingEmail = await User.emailExists(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }
        }

        next();
    } catch (error) {
        console.error('Error verificando usuario existente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Sanitizar datos de entrada
const sanitizeInput = (req, res, next) => {
    // Remover espacios en blanco innecesarios
    if (req.body.username) {
        req.body.username = req.body.username.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim();
    }
    
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateUpdateProfile,
    handleValidationErrors,
    checkUserExists,
    sanitizeInput
};