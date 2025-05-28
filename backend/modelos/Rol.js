// backend/modelos/Rol.js
class Rol {
    // Obtiene rol por su id
    static async obtenerPorId(pool, id) {
      const [filas] = await pool.query('SELECT * FROM rol WHERE id = ?', [id]);
      return filas[0];
    }
  
    // Lista todos los roles
    static async listar(pool) {
      const [filas] = await pool.query('SELECT * FROM rol');
      return filas;
    }
  }
  
  module.exports = Rol;
  