const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.post('/getRequestStats', authMiddleware, async (req, res) => {
    try {
      const cerereId = req.body.idCerere;
  
      if (!cerereId) {
        return res.status(400).json({ error: 'ID-ul cererii este necesar.' });
      }
  
      const cerere = await Cerere.getStats(cerereId);

      if (!cerere) {
        return res.status(404).json({ error: 'Cererea nu a fost găsită.' });
      }
      const student = await Student.getStudentById(cerere.student_id);
  
      return res.status(200).json({cerere : cerere,student : student});
    } catch (error) {
      console.error('Eroare la procesarea cererii:', error);
      return res.status(500).json({ error: 'Eroare internă a serverului.' });
    }
  });

  
module.exports = router