export default function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: Login required' });
  }
  next();
}
