// frontend/js/carrito.js

import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const carritoBtn = document.createElement('button');
  carritoBtn.id = 'carrito-flotante';
  carritoBtn.textContent = '🛒 Carrito (0)';
  carritoBtn.style.position = 'fixed';
  carritoBtn.style.bottom = '20px';
  carritoBtn.style.right = '20px';
  carritoBtn.style.padding = '10px 20px';
  carritoBtn.style.backgroundColor = '#40E0D0';
  carritoBtn.style.color = '#fff';
  carritoBtn.style.border = 'none';
  carritoBtn.style.borderRadius = '5px';
  carritoBtn.style.cursor = 'pointer';
  document.body.appendChild(carritoBtn);

  carritoBtn.addEventListener('click', () => {
    window.location.href = '/carrito.html';
  });

  async function actualizarContador() {
    try {
      const carrito = await api.getCarrito();
      const totalItems = carrito.productos.reduce((sum, item) => sum + item.cantidad, 0);
      carritoBtn.textContent = `🛒 Carrito (${totalItems})`;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    }
  }

  actualizarContador();
});
