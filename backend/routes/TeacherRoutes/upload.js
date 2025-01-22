const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
const authMiddleware = require('../../middleware/auth');
const multer = require('multer');
const  Professor  = require('../../database/models/Profesor');
const upload = multer();

router.post('/uploadPdfProfesor', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const idCerere = req.idCerere;
    const pdfBuffer = req.file.buffer;

    const actualizareCuSucces = await Cerere.actualizeazaPdfProfesor(idCerere, pdfBuffer);

    if (!actualizareCuSucces) {
      return res.status(400).json({ error: 'No file uploaded or request not found' });
    }
    

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
  
  