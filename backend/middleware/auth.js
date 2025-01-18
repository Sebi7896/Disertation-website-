const jwt = require('../utils/jwt.js');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Așteaptă decodarea token-ului
    const decoded = await jwt.verifyToken(token);

    // Adaugă utilizatorul decodat în request pentru utilizare ulterioară
    req.user = decoded;
    next(); // Trece la următorul middleware sau endpoint
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authMiddleware;