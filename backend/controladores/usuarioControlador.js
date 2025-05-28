// backend/controladores/usuarioControlador.js
const Usuario = require('../modelos/Usuario');

async function registrarCliente(req, res) {
  const { nombre, correo, clave } = req.body;
  if (!nombre || !correo || !clave) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const nuevo = await Usuario.crearCliente(req.pool, { nombre, correo, clave });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await Usuario.listar(req.pool);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { registrarCliente, obtenerUsuarios };
