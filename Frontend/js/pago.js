// frontend/js/pago.js

import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const pagarBtn = document.getElementById('btn-pagar');
  const totalSpan = document.getElementById('total-pagar');
  let total = 0;

  async function calcularTotal() {
    try {
      const carrito = await api.getCarrito();
      total = carrito.productos.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
      totalSpan.textContent = `$${total.toFixed(2)}`;
    } catch (error) {
      alert('Error al cargar el carrito: ' + error.message);
    }
  }

  pagarBtn.addEventListener('click', async () => {
    if (total <= 0) {
      alert('No hay productos en el carrito.');
      return;
    }

    try {
      const metodo = 'Simulado'; // Puedes luego cambiar esto a 'QR' si reactivas esa funcionalidad
      const res = await api.realizarPago(total, metodo);
      alert(`✅ Pago registrado exitosamente. ID: ${res.registro.id}`);
      // Redirigir o recargar
      window.location.href = '/gracias.html';
    } catch (error) {
      alert('Error al realizar el pago: ' + error.message);
    }
  });

  calcularTotal();
});
