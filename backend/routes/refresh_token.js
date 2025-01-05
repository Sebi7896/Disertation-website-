const express = require('express');
const jwt = require('jsonwebtoken');
const Token = require('../database/models/Token');
const { generateAccessToken } = require('../utils/jwt');
require('dotenv').config();

const router = express.Router();

// Endpoint pentru a obține un nou access token folosind refresh token-ul
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;  // Preia refresh token-ul din cookie

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  try {
    // Verifică dacă refresh token-ul exista în baza de date
    const tokenRecord = await Token.findOne({ where: { token: refreshToken } });

    
    if (!tokenRecord) {
      return res.status(403).json({ message: 'Invalid refresh token in data base' });
    }

    // Verifică dacă refresh token-ul este valid cu jwt secret
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        
        return res.status(403).json({ message: 'Invalid refresh token ' });
      }
      // Dacă refresh token-ul este valid, semnează un nou access token
      const newAccessToken = generateAccessToken(user.id);

      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error in refreshing token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

