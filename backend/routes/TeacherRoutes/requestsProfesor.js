const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');

router.get('/requestsProfesor', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.userId; 
        //const profesor =await Profesor.getProfesorById(user_id);
        const cereri =await Cerere.getCereriProfesor(user_id);
        
        return res.status(200).json({cereri: cereri});
    }catch (error) {
        console.error('Error in requestsProfesor:', error);
        return res.status(401).json({ message: error.message });
    }    
});
  
module.exports = router;