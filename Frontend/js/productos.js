// frontend/js/productos.js

import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const productosContainer = document.getElementById('productos-container');
  const productoForm = document.getElementById('producto-form');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = usuario && usuario.rol === 'admin';

  async function cargarProductos() {
    try {
      const productos = await api.getProductos();
      productosContainer.innerHTML = '';
      productos.forEach((producto) => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
          <img src="${producto.imagen || 'default-image.jpg'}" alt="${producto.nombre}" />
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

  if (isAdmin && productoForm) {
    productoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      const nombre = productoForm.nombre.value;
      const descripcion = productoForm.descripcion.value;
      const precio = parseFloat(productoForm.precio.value);
      const foto = productoForm.foto.files[0]; // Tomamos el archivo de imagen

      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('precio', precio);
      formData.append('foto', foto); // Se agrega la foto al FormData

      try {
        await api.crearProducto(formData); // Mandamos FormData al servidor
        alert('Producto creado exitosamente');
        productoForm.reset();
        cargarProductos();
      } catch (error) {
        alert('Error al crear producto: ' + error.message);
      }
    });
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
