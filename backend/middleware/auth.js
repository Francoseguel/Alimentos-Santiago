import jwt from 'jsonwebtoken';
const SECRET_KEY = 'claveSuperSecreta123';

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ mensaje: 'Falta token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido' });
  }
}

export function soloAdmin(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
}
