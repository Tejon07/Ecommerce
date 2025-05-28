// backend/servidor.js

require('dotenv').config();              // 1) Carga variables de .env
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');        // Se importa multer

const app = express();

// Configurar multer para guardar las imágenes en una carpeta 'uploads'
const upload = multer({
  dest: 'uploads/', // Aquí se guardarán las imágenes
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de tamaño de archivo: 5MB
}).single('foto'); // Usamos 'foto' como el campo de la imagen en el formulario

// 1a) Middleware global
app.use(cors());                         // Permite peticiones desde cualquier origen
app.use(express.json());                 // Parse JSON en body
app.use(express.urlencoded({ extended: true })); // Parse URL‑encoded (forms)
app.use(express.static('Frontend'));
app.use(express.static('uploads')); // Asegúrate de poder servir archivos estáticos desde 'uploads'

// 2) Conexión a la base de datos
let pool;
async function conectarBD() {
  pool = await mysql.createPool({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10),   // Asegura que sea número
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });
  console.log('🔌 Conectado a la base de datos');
}
conectarBD().catch(err => {
  console.error('❌ No se pudo conectar a la BD:', err);
  process.exit(1);
});

// 3) Hacer el pool disponible en cada petición
app.use((req, res, next) => {
  if (!pool) {
    return res.status(500).json({ error: 'Pool de BD no inicializado aún.' });
  }
  req.pool = pool;
  next();
});

// 4) Ruta de prueba para verificar conexión
app.get('/api/prueba-db', async (req, res) => {
  try {
    const [rows] = await req.pool.query('SELECT 1 + 1 AS resultado');
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (err) {
    console.error('Error en /api/prueba-db:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 5) Montar routers de tus módulos
app.use('/api/auth',      require('./rutas/autenticacion'));
app.use('/api/usuarios',  require('./rutas/usuarios'));
app.use('/api/productos', require('./rutas/productos'));  // Aquí ya manejarás las imágenes
app.use('/api/carrito',   require('./rutas/carrito'));
app.use('/api/pago',      require('./rutas/pago'));

// 6) Control de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 7) Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 8) Arrancar servidor
const PUERTO = parseInt(process.env.PUERTO, 10) || 3000;
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PUERTO}`);
});
