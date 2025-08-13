import { verifyJwt } from '../utils/jwt.js';

export default function getUserFromToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  const user = verifyJwt(token);
  req.user = user || null;
  next();
}
