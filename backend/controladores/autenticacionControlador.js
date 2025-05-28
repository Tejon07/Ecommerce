// backend/controladores/autenticacionControlador.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');
const Rol     = require('../modelos/Rol');

async function login(req, res) {
  const { correo, clave } = req.body;
  if (!correo || !clave) {
    return res.status(400).json({ error: 'Correo y clave son obligatorios' });
  }

  const usuario = await Usuario.buscarPorCorreo(req.pool, correo);
  if (!usuario) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const coincide = await bcrypt.compare(clave, usuario.clave);
  if (!coincide) {
    return res.status(401).json({ error: 'Clave incorrecta' });
  }

  // Obtener rol
  const rol = await Rol.obtenerPorId(req.pool, usuario.rol_id);

  const token = jwt.sign(
    { id: usuario.id, rol: rol.nombre },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: rol.nombre } });
}

module.exports = { login };
