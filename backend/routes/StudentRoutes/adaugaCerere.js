const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.js');
const Cerere = require('../../database/models/Cerere.js');
const Student = require('../../database/models/Student.js');
const e = require('express');
const { use } = require('./chooseTeacher.js');
//const bcrypt = require('bcryptjs');


//adaugam o cerere preliminara dupa prof pending
router.put('/adaugaCerere', authMiddleware, async (req, res) => {
    const { idProfesor, mesaj, titlul } = req.body;
    const userId = req.user.userId;
    if (!idProfesor || !mesaj || !titlul) {
        return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
    }
    try {
        // Verificăm dacă cererea aparține studentului
        const studentId =await Student.getStudentIdByUserId(userId);
    
        // Inseram datele noi în baza de date
        console.log(studentId, idProfesor, mesaj, titlul);  
        const inserata = await Cerere.insertTitleAndMessage(titlul, mesaj, idProfesor,studentId);
        if (!inserata) {
            return res.status(500).json({ message: 'Eroare la inserarea cererii.' });
        }
        res.status(200).json({ message: 'Cerere inserată cu succes!' });
    } catch (error) {
        console.error('Error in insert:', error);
        res.status(500).json({ message: 'Eroare la procesarea cererii.', error });
    }
});

module.exports = router;
