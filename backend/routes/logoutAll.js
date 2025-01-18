const express = require('express');
const router = express.Router();
const Token = require('../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/auth');

router.post('/logout-all', authMiddleware, async (req, res) => {
    const userId = req.user.userId; // Obține ID-ul utilizatorului din token (furnizat de authMiddleware)
  
    try {
      // Verifică dacă există refresh token-uri asociate cu utilizatorul
      const tokens = await Token.findAll({ where: { user_id: userId } });
  
      if (tokens.length === 0) {
        return res.status(200).json({ message: 'No active sessions found. Already logged out from all devices.' });
      }
  
      // Șterge toate refresh token-urile din baza de date pentru acest utilizator
      await Token.destroy({ where: { user_id: userId } });
  
      return res.status(200).json({ message: 'Logged out from all devices' });
    } catch (error) {
      console.error('Logout all error:', error);
      return res.status(500).json({ message: 'Failed to log out from all devices' });
    }
  });
  
module.exports = router;