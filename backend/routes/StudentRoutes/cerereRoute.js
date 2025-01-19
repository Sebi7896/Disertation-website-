const express = require('express');
const router = express.Router();
const Cerere = require('../../database/models/Cerere');
require('dotenv').config();
const Student = require('../../database/models/Student');
const authMiddleware = require('../../middleware/auth');

router.post('/cerereRoute', authMiddleware, async (req, res) => {

    try {
        const userID = req.user.userId;
        console.log(userID);
        const student_id = await Student.getStudentByUserId(userID);
        console.log(student_id);
        const cerere = await Cerere.getCerereDupaId(student_id);
        return res.status(200).json({cerere: cerere});
    }catch (error) {
        console.error('Error in cerereRoute:', error);
        return res.status(401).json({ message: error.message });
    }
});
  
module.exports = router;