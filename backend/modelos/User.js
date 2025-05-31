const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.password = userData.password;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
        this.is_active = userData.is_active;
        this.last_login = userData.last_login;
        this.role = userData.role;
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            const { username, email, password, role = 'user' } = userData;
            
            // Hash de la contraseña
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `
                INSERT INTO usuarios (username, email, password, role) 
                VALUES (?, ?, ?, ?)
            `;
            const params = [username, email, hashedPassword, role];
            
            const result = await executeQuery(query, params);
            
            if (result.insertId) {
                return await User.findById(result.insertId);
            }
            return null;
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM usuarios WHERE id = ? AND is_active = TRUE';
            const result = await executeQuery(query, [id]);
            
            if (result.length > 0) {
                return new User(result[0]);
            }
            return null;
        } catch (error) {
            console.error('Error buscando usuario por ID:', error);
            throw error;
        }
    }

    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const query = 'SELECT * FROM usuarios WHERE username = ? AND is_active = TRUE';
            const result = await executeQuery(query, [username]);
            
            if (result.length > 0) {
                return new User(result[0]);
            }
            return null;
        } catch (error) {
            console.error('Error buscando usuario por username:', error);
            throw error;
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM usuarios WHERE email = ? AND is_active = TRUE';
            const result = await executeQuery(query, [email]);
            
            if (result.length > 0) {
                return new User(result[0]);
            }
            return null;
        } catch (error) {
            console.error('Error buscando usuario por email:', error);
            throw error;
        }
    }

    // Verificar si username existe
    static async usernameExists(username, excludeId = null) {
        try {
            let query = 'SELECT id FROM usuarios WHERE username = ?';
            let params = [username];
            
            if (excludeId) {
                query += ' AND id != ?';
                params.push(excludeId);
            }
            
            const result = await executeQuery(query, params);
            return result.length > 0;
        } catch (error) {
            console.error('Error verificando username:', error);
            throw error;
        }
    }

    // Verificar si email existe
    static async emailExists(email, excludeId = null) {
        try {
            let query = 'SELECT id FROM usuarios WHERE email = ?';
            let params = [email];
            
            if (excludeId) {
                query += ' AND id != ?';
                params.push(excludeId);
            }
            
            const result = await executeQuery(query, params);
            return result.length > 0;
        } catch (error) {
            console.error('Error verificando email:', error);
            throw error;
        }
    }

    // Verificar contraseña
    async verifyPassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.error('Error verificando contraseña:', error);
            throw error;
        }
    }

    // Actualizar último login
    async updateLastLogin() {
        try {
            const query = 'UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
            await executeQuery(query, [this.id]);
            this.last_login = new Date();
        } catch (error) {
            console.error('Error actualizando último login:', error);
            throw error;
        }
    }

    // Obtener datos del usuario sin la contraseña
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }

    // Obtener todos los usuarios (para admin)
    static async getAll(limit = 50, offset = 0) {
        try {
            const query = `
                SELECT id, username, email, created_at, updated_at, is_active, last_login, role 
                FROM usuarios 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            `;
            const result = await executeQuery(query, [limit, offset]);
            return result.map(userData => new User(userData));
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            throw error;
        }
    }

    // Contar usuarios totales
    static async count() {
        try {
            const query = 'SELECT COUNT(*) as total FROM usuarios WHERE is_active = TRUE';
            const result = await executeQuery(query);
            return result[0].total;
        } catch (error) {
            console.error('Error contando usuarios:', error);
            throw error;
        }
    }

    // Actualizar usuario
    async update(updateData) {
        try {
            const allowedFields = ['username', 'email', 'role'];
            const updates = [];
            const values = [];

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key) && value !== undefined) {
                    updates.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (updates.length === 0) {
                return this;
            }

            values.push(this.id);
            const query = `UPDATE usuarios SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            
            await executeQuery(query, values);
            
            // Recargar datos del usuario
            const updatedUser = await User.findById(this.id);
            Object.assign(this, updatedUser);
            
            return this;
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    }

    // Desactivar usuario (soft delete)
    async deactivate() {
        try {
            const query = 'UPDATE usuarios SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            await executeQuery(query, [this.id]);
            this.is_active = false;
        } catch (error) {
            console.error('Error desactivando usuario:', error);
            throw error;
        }
    }
}

module.exports = User;
