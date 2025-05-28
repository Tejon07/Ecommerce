// backend/modelos/Usuario.js
const bcrypt = require('bcryptjs');

class Usuario {
  // Busca un usuario por correo
  static async buscarPorCorreo(pool, correo) {
    const [filas] = await pool.query(
      'SELECT * FROM usuario WHERE correo = ?', [correo]
    );
    return filas[0];
  }

  // Crea un nuevo cliente (rol_id = 3 por ejemplo)
  static async crearCliente(pool, { nombre, correo, clave }) {
    const hash = await bcrypt.hash(clave, 10);
    const [resultado] = await pool.query(
      'INSERT INTO usuario (nombre, correo, clave) VALUES (?,?,?)',
      [nombre, correo, hash]
    );
    return { id: resultado.insertId, nombre, correo };
  }

  // Listar todos los usuarios
  static async listar(pool) {
    const [filas] = await pool.query('SELECT id, nombre, correo FROM usuario');
    return filas;
  }
}

module.exports = Usuario;
