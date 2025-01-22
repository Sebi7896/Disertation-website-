const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.js');
const Cerere = require('../../database/models/Cerere.js');
const Student = require('../../database/models/Student.js');
const e = require('express');
const { use } = require('./chooseTeacher.js');
const  Professor = require('../../database/models/Profesor.js');
//const bcrypt = require('bcryptjs');


//adaugam o cerere preliminara dupa prof pending
router.put('/actualizeazaTitlulMesaj', authMiddleware, async (req, res) => {
    const { idCerere, mesaj, titlul } = req.body;
    if (!idCerere || !mesaj || !titlul) {
        return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
    }
    try {
        const updateCerere = await Cerere.actualizeazaTitluMesaj(idCerere, titlul, mesaj);

        if (!updateCerere) {
            return res.status(404).json({ message: 'Cererea nu a fost găsită sau nu s-a putut actualiza.' });
        }

        // Răspuns cu succes
        res.status(200).json({ message: 'Cererea a fost actualizată cu succes.', data: updateCerere });
    } catch (error) {
        console.error('Error in update:', error);

        // Răspuns cu eroare
        res.status(500).json({ message: 'Eroare la procesarea cererii.', error });
    }
});


module.exports = router;
