const express = require('express');
const router = express.Router();
const Token = require('../../database/models/Token');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const Student = require('../../database/models/Student');
const Profesor = require('../../database/models/Profesor');
const Cerere = require('../../database/models/Cerere');
const authMiddleware = require('../../middleware/auth');


//pentru a alege profesorii disponibili si pe care nu i a ales deja
router.get('/checkRequests', authMiddleware, async (req, res) => {
    const user_id = req.user.userId; 
    const studentId =await Student.getStudentIdByUserId(user_id);

    const cereri = await Cerere.getCereriDupaId(studentId); 
    const cerereAcceptata = cereri.find(cerere => cerere.status_acceptare_profesor === "accepted");
    return res.status(200).json({
        message: cerereAcceptata ? 'Cererea a fost acceptată' : 'Cererea nu a fost acceptată',
        cerere: !!cerereAcceptata
    });
});
  
module.exports = router;