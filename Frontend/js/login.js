// frontend/js/login.js

import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      alert('Inicio de sesión exitoso');
      window.location.href = '/index.html';
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = registerForm.nombre.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    try {
      await api.register({ nombre, email, password });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      registerForm.reset();
    } catch (error) {
      alert('Error al registrarse: ' + error.message);
    }
  });
});
