const express = require('express');
const router = express.Router();
const Student = require('../../database/models/Student');
const Cerere = require('../../database/models/Cerere');
const authMiddleware = require('../../middleware/auth');
const multer = require('multer');
const upload = multer();

router.post('/uploadPdf', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.userId; 
    const studentId = await Student.getStudentIdByUserId(userId);
    const pdfBuffer = req.file.buffer;

    const actualizareCuSucces = await Cerere.actualizeazaPdf(studentId, pdfBuffer);

    if (!actualizareCuSucces) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
  
  