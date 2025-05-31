const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a la base de datos establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        return false;
    }
};

// Función para ejecutar consultas
const executeQuery = async (query, params = []) => {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Error ejecutando consulta:', error);
        throw error;
    }
};

// Función para inicializar la base de datos
const initializeDatabase = async () => {
    try {
        // Crear tabla de usuarios si no existe
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP NULL,
                role ENUM('user', 'admin') DEFAULT 'user'
            )
        `;

        await executeQuery(createUsersTable);
        console.log('✅ Tabla usuarios creada/verificada correctamente');

        // Crear índices para mejorar rendimiento
        const createIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_username ON usuarios(username)',
            'CREATE INDEX IF NOT EXISTS idx_email ON usuarios(email)',
            'CREATE INDEX IF NOT EXISTS idx_active ON usuarios(is_active)'
        ];

        for (const indexQuery of createIndexes) {
            await executeQuery(indexQuery);
        }

        console.log('✅ Índices creados/verificados correctamente');
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        throw error;
    }
};

module.exports = {
    pool,
    testConnection,
    executeQuery,
    initializeDatabase
};