// backend/controladores/pagoControlador.js

const Pago = require('../modelos/Pago');
// const qr = require('qrcode');    // Lo comentamos porque de momento no generamos QR

async function generarQr(req, res) {
  try {
    const { monto, metodo } = req.query;
    // registrar pago simulado
    const registro = await Pago.registrar(req.pool, {
      usuario_id: req.usuario.id,
      monto: parseFloat(monto) || 0,
      metodo: metodo || 'QR'
    });

    // --- Código de QR comentado ---
    // const data = `pago:${registro.id}|usuario:${registro.usuario_id}|monto:${registro.monto}`;
    // const qrImage = await qr.toDataURL(data);
    // res.json({ registro, qr: qrImage });
    // -------------------------------

    // Por ahora devolvemos solo el registro
    res.json({ registro });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generarQr };
