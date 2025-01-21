require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');

const generateAccessToken =async (userId,role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN });
  };
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId  }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN });
}
const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        // Dacă token-ul este invalid sau expirat, respinge promisiunea
        return reject(err);
      } else {
        // Dacă verificarea este reușită, returnează payload-ul decodat
        resolve(decoded);
      }
    });
  });
};
module.exports = { generateAccessToken,generateRefreshToken,verifyToken };