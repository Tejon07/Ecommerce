const express = require('express');
const router = express.Router();
const autenticarJWT = require('../middleware/autenticarJWT');
const { generarQr } = require('../controladores/pagoControlador');

// Genera un QR (falso por ahora)
router.get('/qr', autenticarJWT, generarQr);

module.exports = router;
