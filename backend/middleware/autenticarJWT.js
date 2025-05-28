// Verifica que venga un Authorization: Bearer <token>
const jwt = require('jsonwebtoken');

module.exports = function autenticarJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token faltante' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id, rol: payload.rol };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
