const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
require('dotenv').config();
const Student = require('../../database/models/Student');
const authMiddleware = require('../../middleware/auth');

router.get('/statusProfesor', authMiddleware, async (req, res) => {
    try {

        //dee facut sa meargaq
        const userID = req.user.userId;
        const idStudent = req.body.idStudent;

        const student_id = await Student.getStudentByUserId(userID);

        if(student_id != idStudent){
            return res.status(401).json({ message: ";))" });
        }
        
        const pending = await Student.getPendingProfesor(student_id);
        return res.status(200).json({pending: pending});
    }catch (error) {
        console.error('Error in idStudentCerere:', error);
        return res.status(401).json({ message: error.message });
    }
    
});
  
module.exports = router;