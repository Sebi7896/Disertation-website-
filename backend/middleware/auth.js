const jwt = require('../utils/jwt.js');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = await jwt.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
    req.user = decoded;
    next(); 
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authMiddleware;