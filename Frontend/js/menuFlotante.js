// frontend/js/menuFlotante.js

document.addEventListener('DOMContentLoaded', () => {
    // No mostrar menú flotante en login.html
    if (window.location.pathname.includes('login.html')) return;
  
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return;
  
    const menu = document.createElement('div');
    menu.className = 'menu-flotante';
  
    let contenido = `<h4>Hola, ${usuario.usuario}</h4>
      <a href="index.html">Inicio</a>
      <a href="usuarios.html">Tienda</a>
      <a href="carrito.html">Carrito</a>
      <a href="pago.html">Pagar</a>`;
  
    if (usuario.rol === 'admin') {
      contenido += `<a href="productos.html">Gestionar productos</a>`;
    }
  
    contenido += `<a href="#" id="cerrar-sesion">Cerrar sesión</a>`;
  
    menu.innerHTML = contenido;
    document.body.appendChild(menu);
  
    document.getElementById('cerrar-sesion').addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = 'login.html';
    });
  });
  