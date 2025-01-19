const express = require('express');
const router = express.Router();
const Token = require('../../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const Student = require('../../database/models/Student');
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');

router.post('/chooseTeacher', authMiddleware, async (req, res) => {
    //dee facut sa meargaq
    const studentId = req.user.userId; 
    const student =await Student.getStudentById(studentId);
    const teachers =await Profesor.getAllProfesors(student.facultate,student.specializare);
    return res.status(200).json({studentId: studentId, student: student, teachers: teachers});
});
  
module.exports = router;