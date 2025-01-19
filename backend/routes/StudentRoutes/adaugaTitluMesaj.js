const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere.js');
const e = require('express');
//const bcrypt = require('bcryptjs');


// Endpoint pentru actualizare resursă
router.put('/titleMesaj', authMiddleware, async (req, res) => {
    const idStudent = req.body.idStudent;
    const idCerere = req.body.idCerere;
    const idProfesor = req.body.idProfesor;
    const mesaj = req.body.mesaj;
    const titlul = req.body.titlu;
    try {
        //select in cerere where idStudent 
        const idCerereSelectat = await Cerere.getCerereDupaId(idStudent);
        if(idCerereSelectat.id !== idCerere || idCerereSelectat === false){
            return res.status(404).json({ message: ';))' });
        }

        const updatedResource =  await Cerere.updateTitleAndMessage(titlul,mesaj,idProfesor,idCerere);
        if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Cerere actualizata cu succes!' });
    } catch (error) {
        console.error('Error in updateResource:', error);
        res.status(500).json({ message: 'Error updating resource',error:error });
    }
});

module.exports = router;
