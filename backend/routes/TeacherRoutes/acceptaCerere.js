const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.post('/actualizeazaCerereStudent', authMiddleware, async (req, res) => {
    
  });
  
  
module.exports = router;