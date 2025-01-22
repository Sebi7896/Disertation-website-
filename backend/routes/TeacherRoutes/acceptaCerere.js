const express = require('express');
const router = express.Router();
const Profesor = require('../../database/models/Profesor');
const authMiddleware = require('../../middleware/auth');
const Cerere = require('../../database/models/Cerere');
const Student = require('../../database/models/Student');


router.put('/actualizeazaCerereStudent', authMiddleware, async (req, res) => {
    const idCerere = req.body.idCerere;
  
    try {
      const idStudentCerere = await Cerere.actualizeazaStatusAprobareProfesor(idCerere);

      if (idStudentCerere) {
        //stergem celelalte cereri
        const idStudent = idStudentCerere.dataValues.student_id;
        const cerere =await Cerere.stergeCerereDupaIdStudent(idStudent);
        const id_profesor =await Cerere.getProfessorIdByRequestId(idCerere);
        const updatare = await Profesor.scadeStudentAprobatDupaIdCerere(id_profesor);

        return res.status(200).json({ message: "Cerere actualizata cu succes! "});
      } else {
        return res.status(404).json({ message: "Cererea cu acest ID nu a fost găsită." });
      }
    } catch (error) {
      console.error("Eroare la actualizarea cererii:", error);
      return res.status(500).json({ message: "A apărut o eroare internă." });
    }
  });
  
  
module.exports = router;