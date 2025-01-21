const express = require('express');
const router = express.Router();
const Token = require('../../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const Student = require('../../database/models/Student');
const Professor = require('../../database/models/Profesor');
const Cerere = require('../../database/models/Cerere');
const authMiddleware = require('../../middleware/auth');


//pentru a alege profesorii disponibili si pe care nu i a ales deja
router.post('/chooseTeacher', authMiddleware, async (req, res) => {
    const user_id = req.user.userId; 
    const studentId =await Student.getStudentIdByUserId(user_id);
    const student = await Student.getStudentById(user_id);
    const cereri = await Cerere.getIdProfesoriCereri(studentId); 
    //preia toti profii disponibili si care nu sunt deja alesi
    const teachers =await Student.getProfesoriDeAlesFacultateSpecializare(studentId,cereri);
    return res.status(200).json({studentId: studentId, teachers: teachers, student: student});
});
  
module.exports = router;