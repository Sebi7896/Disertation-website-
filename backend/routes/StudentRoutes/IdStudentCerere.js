
const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
require('dotenv').config();
const Student = require('../../database/models/Student');
const authMiddleware = require('../../middleware/auth');

router.post('/idStudentCerere', authMiddleware, async (req, res) => {
    try {
        const userID = req.user.userId;
        const idStudent = await Student.getStudentByUserId(userID);
        const cerere = await Cerere.getCerereDupaId(idStudent);
        return res.status(200).json({idStudent: idStudent,idCerere: cerere.id});
    }catch (error) {
        console.error('Error in idStudentCerere:', error);
        return res.status(401).json({ message: error.message });
    }
    
});
  
module.exports = router;