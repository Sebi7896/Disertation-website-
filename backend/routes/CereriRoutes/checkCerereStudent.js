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
router.get('/checkCerereStudent', authMiddleware, async (req, res) => {
    const user_id = req.user.userId; 
    const studentId =await Student.getStudentIdByUserId(user_id);

    const cereri = await Cerere.getCereriDupaId(studentId); 
    console.log(cereri);
    if(cereri.length === 1) {
        if(cereri.at(0).status_acceptare_profesor === 'pending') {
            res.status(200).json({route: '/HomeStudent'});
        }else {
            console.log(cereri.at(0).signed_by_professor)
            if(cereri.at(0).signed_by_professor) {
                res.status(200).json({route: '/RutaFinalaAcceptat'});
            }else {
                res.status(200).json({route: '/IncarcarePdf'});
            }
        }
    } else {
        res.status(200).json({route: '/HomeStudent'});
    }   
});
  
module.exports = router;