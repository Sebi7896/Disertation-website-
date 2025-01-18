const express = require('express');
const router = express.Router();
const Token = require('../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');


router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
      }
      try {
        // Șterge refresh token-ul din baza de date
        await Token.destroy({ where: { token: refreshToken } });          
        return res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Failed to log out' });
      }
  });

module.exports = router;

