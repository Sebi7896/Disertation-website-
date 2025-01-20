const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth.js');
const Cerere = require('../../database/models/Cerere.js');
const e = require('express');
//const bcrypt = require('bcryptjs');


//adaugam o cerere preliminara dupa prof pending
router.put('/adaugaCerere', authMiddleware, async (req, res) => {
    const { idStudent, idCerere, idProfesor, mesaj, titlu } = req.body;
    if (!idStudent || !idCerere || !idProfesor || !mesaj || !titlu) {
        return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
    }
    try {
        // Verificăm dacă cererea aparține studentului
        const idCerereSelectat = await Cerere.getCerereDupaId(idStudent);

        if (!idCerereSelectat || idCerereSelectat.id !== idCerere) {
            return res.status(404).json({ message: ';))' });
        }

        // Inseram datele noi în baza de date
        const inserata = await Cerere.insertTitleAndMessage(titlu, mesaj, idProfesor,idStudent);

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
