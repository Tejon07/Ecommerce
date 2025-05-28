// backend/modelos/Pago.js
class Pago {
    // Crea un registro de pago (sólo simulación)
    static async registrar(pool, { usuario_id, monto, metodo }) {
      const [res] = await pool.query(
        'INSERT INTO pago (usuario_id, monto, metodo) VALUES (?,?,?)',
        [usuario_id, monto, metodo]
      );
      return { id: res.insertId, usuario_id, monto, metodo };
    }
  }
  
  module.exports = Pago;
  