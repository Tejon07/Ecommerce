const express = require('express');
const router = express.Router();

// Ruta de ejemplo para login
router.post('/login', (req, res) => {
    res.json({ mensaje: 'Ruta de login' });
});

// Ruta de ejemplo para registro
router.post('/registro', (req, res) => {
    res.json({ mensaje: 'Ruta de registro' });
});

// Exportar el router
module.exports = router;