const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token);
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401).json({ error: 'Access denied' });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err){
      console.error('Token verification error:', err);
      return res.sendStatus(403).json({ error: 'Invalid token' });;
    }

    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
