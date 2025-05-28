const express = require('express');
const router = express.Router();
const autenticarJWT = require('../middleware/autenticarJWT');
const { verCarrito, agregarAlCarrito, vaciarCarrito } = require('../controladores/carritoControlador');

// Todas las rutas de carrito requieren usuario autenticado
router.use(autenticarJWT);

router.get('/', verCarrito);
router.post('/agregar', agregarAlCarrito);
router.delete('/vaciar', vaciarCarrito);

module.exports = router;
