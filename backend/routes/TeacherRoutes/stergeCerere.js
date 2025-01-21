const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.post('/stergeCerere', authMiddleware, async (req, res) => {
    try {
      const user_id = req.user.userId;
      const { idCerere } = req.body;
  
      if (!idCerere) {
        return res.status(400).json({ message: "ID-ul cererii este necesar." });
      }
  
      const rezultat = await Cerere.stergeCerereDupaId(idCerere);
  
      if (rezultat) {
        return res.status(200).json({ message: "Cererea a fost ștearsă cu succes." });
      } else {
        return res.status(404).json({ message: "Cererea nu a fost găsită." });
      }
    } catch (error) {
      console.error("Eroare la ștergerea cererii:", error);
      return res.status(500).json({ message: "A apărut o eroare internă." });
    }
  });
  
  
module.exports = router;