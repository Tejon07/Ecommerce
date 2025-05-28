const express = require('express');
const router = express.Router();
const autenticarJWT = require('../middleware/autenticarJWT');
const verificarRol = require('../middleware/verificarRol');
const { crearProducto, listarProductos, eliminarProducto } = require('../controladores/productoControlador');

// Cualquiera ve productos
router.get('/', listarProductos);

// Solo proveedor o master puede agregar
router.post('/', autenticarJWT, verificarRol(['proveedor','master']), crearProducto);

// Solo proveedor o master puede eliminar
router.delete('/:id', autenticarJWT, verificarRol(['proveedor','master']), eliminarProducto);

module.exports = router;
