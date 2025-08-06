import { verifyJwt } from '../utils/jwt.js';

export default async function getUserFromToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next();
  }

  const token = auth.slice(7);
  const payload = verifyJwt(token);

  if (payload) {
    req.user = { id: payload.id, username: payload.username }; // adjust based on token payload
  }
  next();
}