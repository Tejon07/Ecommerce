const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuraciones
const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();

// Configuración de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por IP
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
    }
});
app.use('/api/', limiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Ruta ${req.originalUrl} no encontrada`
    });
});

// Middleware global de manejo de errores
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 5000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();
        console.log('✅ Conexión a la base de datos establecida');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido, cerrando servidor gracefully...');
    process.exit(0);
});

// Iniciar el servidor
startServer();

module.exports = app;