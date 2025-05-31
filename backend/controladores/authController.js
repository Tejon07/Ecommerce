const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

class AuthController {
    // Registro de usuario
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Crear nuevo usuario
            const newUser = await User.create({
                username,
                email,
                password,
                role: 'user'
            });

            if (!newUser) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear el usuario'
                });
            }

            // Generar token
            const token = generateToken(newUser.id);

            // Actualizar último login
            await newUser.updateLastLogin();

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: newUser.toJSON(),
                    token,
                    tokenType: 'Bearer'
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            
            // Manejo de errores específicos de MySQL
            if (error.code === 'ER_DUP_ENTRY') {
                if (error.message.includes('username')) {
                    return res.status(409).json({
                        success: false,
                        message: 'El nombre de usuario ya está en uso'
                    });
                }
                if (error.message.includes('email')) {
                    return res.status(409).json({
                        success: false,
                        message: 'El email ya está registrado'
                    });
                }
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Login de usuario
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Buscar usuario por username o email
            let user = await User.findByUsername(username);
            if (!user) {
                user = await User.findByEmail(username);
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await user.verifyPassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = generateToken(user.id);

            // Actualizar último login
            await user.updateLastLogin();

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    user: user.toJSON(),
                    token,
                    tokenType: 'Bearer'
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Obtener perfil del usuario autenticado
    static async getProfile(req, res) {
        try {
            res.json({
                success: true,
                message: 'Perfil obtenido exitosamente',
                data: {
                    user: req.user.toJSON()
                }
            });
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Actualizar perfil del usuario
    static async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            const updateData = {};

            if (username && username !== req.user.username) {
                // Verificar si el username ya existe
                const usernameExists = await User.usernameExists(username, req.user.id);
                if (usernameExists) {
                    return res.status(409).json({
                        success: false,
                        message: 'El nombre de usuario ya está en uso'
                    });
                }
                updateData.username = username;
            }

            if (email && email !== req.user.email) {
                // Verificar si el email ya existe
                const emailExists = await User.emailExists(email, req.user.id);
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        message: 'El email ya está registrado'
                    });
                }
                updateData.email = email;
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No hay datos para actualizar'
                });
            }

            // Actualizar usuario
            await req.user.update(updateData);

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                data: {
                    user: req.user.toJSON()
                }
            });

        } catch (error) {
            console.error('Error actualizando perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Cambiar contraseña
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Verificar contraseña actual
            const isValidPassword = await req.user.verifyPassword(currentPassword);
            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña actual es incorrecta'
                });
            }

            // Hash de la nueva contraseña
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar contraseña en la base de datos
            const { executeQuery } = require('../config/database');
            await executeQuery(
                'UPDATE usuarios SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [hashedPassword, req.user.id]
            );

            res.json({
                success: true,
                message: 'Contraseña cambiada exitosamente'
            });

        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            res.status(500).json({
