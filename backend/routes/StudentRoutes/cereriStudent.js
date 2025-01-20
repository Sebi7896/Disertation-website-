const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
require('dotenv').config();
const Student = require('../../database/models/Student');
const authMiddleware = require('../../middleware/auth');

//cererile studentului la momentul asta 
router.get('/cereriStudent', authMiddleware, async (req, res) => {

    try {
        const userID = req.user.userId;
        const student_id = await Student.getStudentIdByUserId(userID);
        const cerere = await Cerere.getCereriDupaId(student_id);
        return res.status(200).json({cereri: cerere});
    }catch (error) {
        console.error('Error in cerereRoute:', error);
        return res.status(401).json({ message: error.message });
    }
});
  
module.exports = router;