const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const ruta = req.originalUrl || req.path;
  console.log('➡️ Ruta solicitada:', ruta);

  // 🟢 Permitir rutas públicas (sin token)
  if (
    ruta.startsWith('/auth/login') ||
    ruta.startsWith('/auth/register') ||
    ruta === '/auth' // por seguridad extra
  ) {
    return next(); // ✅ deja pasar al proxy
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // ✅ continuar hacia el proxy
  } catch (err) {
    console.error('❌ Token inválido en Gateway:', err.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verifyToken;
