const express = require('express');
const router = express.Router();
const { registrarCliente, obtenerUsuarios } = require('../controladores/usuarioControlador');
const autenticarJWT = require('../middleware/autenticarJWT');
const verificarRol = require('../middleware/verificarRol');

// Solo admin/master puede listar usuarios
router.get('/', autenticarJWT, verificarRol(['administrador','master']), obtenerUsuarios);

// Registro público de cliente
router.post('/registro', registrarCliente);

module.exports = router;
