const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.get('/getPdf', authMiddleware, async (req, res) => {
    try {
      const idCerere = req.body.idCerere; 
      const pdf = await Cerere.getPdf(idCerere);
      
      if (!pdf) {
        return res.status(404).json({ error: 'Fișierul PDF nu a fost găsit pentru această cerere.' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.title + ".lucrare_disertatie.pdf"}"`);
      res.send(pdf);
      
    } catch (error) {
      console.error('Eroare la descărcarea PDF:', error);
      res.status(500).json({ error: 'Eroare la procesarea cererii.' });
    }
  });


module.exports = router
  