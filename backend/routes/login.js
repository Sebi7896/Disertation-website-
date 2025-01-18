const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User = require('../database/models/Utilizator.js'); 
const Token = require('../database/models/Token.js');
const { generateRefreshToken, generateAccessToken } = require('../utils/jwt.js');
require('dotenv').config();

router.post('/login', async (req, res) => {
   const { email, password } = req.body;
   try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email does not exist!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    const rememberToken = req.body.rememberToken;
    const accessToken = generateAccessToken(user.id,user.dataValues.role);
    if(rememberToken) {
      const refreshToken = generateRefreshToken(user.id);
      await Token.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 zile
      });
    }
    return res.json({ accessToken });
  }catch (error) {return res.status(500).json({ message: 'Internal server error' });}

 });
 module.exports = router;