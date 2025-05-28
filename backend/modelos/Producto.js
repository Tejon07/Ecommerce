// backend/modelos/Producto.js
class Producto {
    // Lista todos los productos
    static async listar(pool) {
      const [filas] = await pool.query(
        'SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, u.nombre AS proveedor \
         FROM producto p JOIN usuario u ON p.proveedor_id = u.id'
      );
      return filas;
    }
  
    // Crea un nuevo producto
    static async crear(pool, { nombre, descripcion, precio, imagen, proveedor_id }) {
      const [result] = await pool.query(
        'INSERT INTO producto (nombre, descripcion, precio, imagen, proveedor_id) VALUES (?,?,?,?,?)',
        [nombre, descripcion, precio, imagen, proveedor_id]
      );
      return { id: result.insertId, nombre, descripcion, precio, imagen, proveedor_id };
    }
  
    // Elimina un producto por id
    static async eliminar(pool, id) {
      await pool.query('DELETE FROM producto WHERE id = ?', [id]);
      return;
    }

    static async llamar(pool) {
      const [filas] = await pool.query('SELECT * FROM producto');
      return filas;
  }
  }


  
  
  module.exports = Producto;
  