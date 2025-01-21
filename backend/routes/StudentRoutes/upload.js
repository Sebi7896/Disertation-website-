const express = require('express');
const router = express.Router();
const Student = require('../../database/models/Student');
const Cerere = require('../../database/models/Cerere');
const authMiddleware = require('../../middleware/auth');
const multer = require('multer');
const storage = multer.memoryStorage(); 


router.post('/upload', authMiddleware, async (req, res) => {
    try {
      if (!req.body || !req.body.length) {
        return res.status(400).json({ error: 'No binary file uploaded' });
      }
  
    
      const pdfBuffer = Buffer.from(req.body);
      const userId = req.user.userId;
      const studentId = await Student.getStudentIdByUserId(userId);
  
      const actualizareCuSucces = await Cerere.actualizeazaPdf(studentId, pdfBuffer);
  
      if (!actualizareCuSucces) {
        return res.status(404).json({ error: 'Failed to update the request with PDF' });
      }
  
      return res.status(200).json({ message: 'File uploaded and associated with request successfully' });
    } catch (error) {
      console.error('Error uploading binary file:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;