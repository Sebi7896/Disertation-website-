const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.get('/getRequestStats', authMiddleware, async (req, res) => {
    try {
      const cerereId = req.body.idCerere;
  
      if (!cerereId) {
        return res.status(400).json({ message: 'ID-ul cererii este obligatoriu.' });
      }
  
      // Apelează metoda asincronă și așteaptă rezultatul
      const cerereTitluMesaj = await Cerere.getMesajTitlul(cerereId);
  
      // Trimite răspunsul cu datele preluate
      return res.status(200).json({ cerere: cerereTitluMesaj });
    } catch (error) {
      console.error('Eroare la preluarea datelor:', error);
      return res.status(500).json({ message: 'Eroare internă a serverului.', error: error.message });
    }
  });
  

  
module.exports = router