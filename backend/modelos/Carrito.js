// backend/modelos/Carrito.js
class Carrito {
    // Obtiene los ítems del carrito de un usuario
    static async obtener(pool, usuario_id) {
      const [filas] = await pool.query(
        'SELECT c.id, p.nombre, p.precio, c.cantidad \
         FROM carrito c JOIN producto p ON c.producto_id = p.id \
         WHERE c.usuario_id = ?', [usuario_id]
      );
      return filas;
    }
  
    // Agrega un producto al carrito (o actualiza cantidad)
    static async agregar(pool, { usuario_id, producto_id, cantidad }) {
      // Ver si ya existe
      const [ex] = await pool.query(
        'SELECT id, cantidad FROM carrito WHERE usuario_id=? AND producto_id=?',
        [usuario_id, producto_id]
      );
      if (ex.length) {
        const nuevaCant = ex[0].cantidad + cantidad;
        await pool.query(
          'UPDATE carrito SET cantidad=? WHERE id=?',
          [nuevaCant, ex[0].id]
        );
        return;
      }
      await pool.query(
        'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?,?,?)',
        [usuario_id, producto_id, cantidad]
      );
    }
  
    // Vacía el carrito de un usuario
    static async vaciar(pool, usuario_id) {
      await pool.query('DELETE FROM carrito WHERE usuario_id=?', [usuario_id]);
    }
  }
  
  module.exports = Carrito;
  