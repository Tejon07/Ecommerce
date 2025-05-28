const express = require('express');
const router = express.Router();
const productoControlador = require('../controladores/productoControlador');

// Middleware para parsear JSON (si no está configurado globalmente)
router.use(express.json());


/**
 * @route POST /productos
 * @desc Crear un nuevo producto
 * @body {nombre, descripcion, id_categoria, stock, precio_compra, precio_venta, imagen}
 */
router.post('/', productoControlador.crear);

/**
 * @route GET /productos
 * @desc Obtener todos los productos activos
 */
router.get('/', productoControlador.obtenerTodos);

/**
 * @route GET /productos/buscar
 * @desc Buscar productos por nombre
 * @query {nombre} - Nombre del producto a buscar
 */
router.get('/buscar', productoControlador.buscarPorNombre);

/**
 * @route GET /productos/categorias
 * @desc Obtener todas las categorías disponibles
 */
router.get('/categorias', productoControlador.obtenerCategorias);

/**
 * @route GET /productos/categoria/:idCategoria
 * @desc Obtener productos por categoría
 * @param {number} idCategoria - ID de la categoría
 */
router.get('/categoria/:idCategoria', productoControlador.obtenerPorCategoria);

/**
 * @route GET /productos/:id
 * @desc Obtener un producto por su ID
 * @param {number} id - ID del producto
 */
router.get('/:id', productoControlador.obtenerPorId);

/**
 * @route PUT /productos/:id
 * @desc Actualizar un producto existente
 * @param {number} id - ID del producto
 * @body {nombre, descripcion, id_categoria, stock, precio_compra, precio_venta, imagen, activo}
 */
router.put('/:id', productoControlador.actualizar);

/**
 * @route DELETE /productos/:id
 * @desc Eliminar un producto (borrado lógico)
 * @param {number} id - ID del producto
 */
router.delete('/:id', productoControlador.eliminar);

module.exports = router;