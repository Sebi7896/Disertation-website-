require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN });
  };
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN });
}

module.exports = { generateAccessToken,generateRefreshToken};