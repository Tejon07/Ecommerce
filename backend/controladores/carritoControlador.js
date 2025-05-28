// backend/controladores/carritoControlador.js
const Carrito = require('../modelos/Carrito');

async function verCarrito(req, res) {
  try {
    const items = await Carrito.obtener(req.pool, req.usuario.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function agregarAlCarrito(req, res) {
  try {
    const { producto_id, cantidad } = req.body;
    await Carrito.agregar(req.pool, { usuario_id: req.usuario.id, producto_id, cantidad });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function vaciarCarrito(req, res) {
  try {
    await Carrito.vaciar(req.pool, req.usuario.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { verCarrito, agregarAlCarrito, vaciarCarrito };
