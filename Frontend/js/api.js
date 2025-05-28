// frontend/js/api.js

const base = 'http://localhost:3000';

export default {
  async login(datos) {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error('Login fallido');
    return res.json();
  },

  async registrar(datos) {
    const res = await fetch(`${base}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!res.ok) throw new Error('Error al registrar');
    return res.json();
  },

  async getProductos() {
    const res = await fetch(`${base}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  async crearProducto(producto) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(producto)
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  },

  async agregarAlCarrito(productoId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productoId })
    });
    if (!res.ok) throw new Error('Error al agregar al carrito');
    return res.json();
  },

  async obtenerCarrito() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/carrito`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error al obtener carrito');
    return res.json();
  },

  async eliminarDelCarrito(productoId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/carrito/${productoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error al eliminar del carrito');
    return res.json();
  },

  async generarQr(monto, metodo) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${base}/pago?monto=${monto}&metodo=${metodo}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error al generar QR');
    return res.json();
  }
};
