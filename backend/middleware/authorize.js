// middleware/authorize.js

function authorize(roles = []) {
    // roles can be a single role string (e.g., 'admin') or an array of roles (e.g., ['admin', 'moderator'])
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
  
  module.exports = authorize;
  