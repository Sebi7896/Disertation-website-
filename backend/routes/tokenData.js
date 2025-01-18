const express = require('express');
const router = express.Router();
const {verifyToken}  = require('../utils/jwt.js');
require('dotenv').config();

router.post('/tokenData', async (req, res) => {
    try {
        const token = req.body.accessToken;
        const decoded = await verifyToken(token); 
        return res.status(200).json({id : decoded.userId , role : decoded.role});
    }catch (error) {
        return res.status(401).json({ message: error.message });
    }

 });
 module.exports = router;