const express = require('express');
const router = express.Router();
const Token = require('../../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const Student = require('../../database/models/Student');
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');

router.post('/homePageTeacher', authMiddleware, async (req, res) => {
    const profesorId = req.user.userId; 
    return res.status(200).json({message : "Welcome to the teacher's homepage datas!"});
});
  
module.exports = router;