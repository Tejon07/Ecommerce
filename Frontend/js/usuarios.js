// frontend/js/usuarios.js

import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const productosContainer = document.getElementById('productos-container');

  async function cargarProductos() {
    try {
      const productos = await api.getProductos();
      productosContainer.innerHTML = '';
      productos.forEach((producto) => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
          <img src="${producto.foto}" alt="${producto.nombre}" />
          <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <button data-id="${producto.id}">Agregar al carrito</button>
          </div>
        `;
        productosContainer.appendChild(productoDiv);
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  productosContainer.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
      const productoId = e.target.getAttribute('data-id');
      try {
        await api.agregarAlCarrito(productoId);
        alert('Producto agregado al carrito');
      } catch (error) {
        alert('Error al agregar al carrito: ' + error.message);
      }
    }
  });

  cargarProductos();
});
