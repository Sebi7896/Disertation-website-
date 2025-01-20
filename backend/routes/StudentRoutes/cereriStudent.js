const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
require('dotenv').config();
const Student = require('../../database/models/Student');
const authMiddleware = require('../../middleware/auth');
const Professor = require('../../database/models/Profesor');

//cererile studentului la momentul asta 
router.get('/cereriStudent', authMiddleware, async (req, res) => {

    try {
        const userID = req.user.userId;
        const student_id = await Student.getStudentIdByUserId(userID);
        const cereri = await Cerere.getCereriDupaId(student_id);
        //id cerere titlu mesaj prenume si nume status acceptare profesor
        for (const cerere of cereri) {
            const profesor = await Professor.getProfessorById(cerere.professor_id);
            cerere.profesor = {
                nume: profesor.dataValues.nume,
                prenume: profesor.dataValues.prenume,
              };
        }
        return res.status(200).json({cereri: cereri});
    }catch (error) {
        console.error('Error in cerereRoute:', error);
        return res.status(401).json({ message: error.message });
    }
});
  
module.exports = router;