// backend/controladores/productoControlador.js
const Producto = require('../modelos/Producto');

async function listarProductos(req, res) {
  try {
    const lista = await Producto.listar(req.pool);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function crearProducto(req, res) {
  try {
    const { nombre, descripcion, precio } = req.body;
    const imagen = req.file ? req.file.filename : null; 
    const proveedor_id = req.usuario.id;
    const prod = await Producto.crear(req.pool, { nombre, descripcion, precio, imagen, proveedor_id });
    res.status(201).json(prod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    await Producto.eliminar(req.pool, id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function obtenerProductos(req, res) {
  try {
    const productos = await Producto.llamar(req.pool);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarProductos, crearProducto, eliminarProducto, obtenerProductos };
