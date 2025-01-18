const express = require('express');
const router = express.Router();
const {verifyToken}  = require('../utils/jwt.js');
require('dotenv').config();

router.post('/tokenData', async (req, res) => {
    const token = req.body.accessToken;
    const decoded = await verifyToken(token); 
    return res.status(200).json({id : decoded.userId , role : decoded.role});
 });
 module.exports = router;