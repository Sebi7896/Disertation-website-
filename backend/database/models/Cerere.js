const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const  Profesor = require("./Profesor.js");
const { Op } = require('sequelize');
const Student = require("./Student.js");
const Cerere = sequelize.define("Cereri", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
    professor_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Profesori',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Studenti',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    signed_by_professor: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    signed_by_student: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status_acceptare_profesor: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    fisier_pdf:{
      type: DataTypes.BLOB('long'),  
      defaultValue: null,
    }
  }, {
    timestamps: false,
    freezeTableName: true
  },
  {
    modelName: 'Cerere',
    tableName: 'Cereri'
  }
);

//returneaza cererile unui student dupa id ul sau
async function getCereriDupaId(studentId) {
  try {
    const cereri = await Cerere.findAll({
      where: { student_id: studentId },
      attributes: ['id', 'title', 'message', 'professor_id', 'status_acceptare_profesor']
    });
    const cereriMapate = cereri.map(cerere => cerere.dataValues);
    return cereriMapate;
  } catch (error) {
    console.error('Error fetching cereri:', error);
    throw error;
  }  
}
//cererile primite de la studenti unui profesor
async function getCereriProfesor(profesor_id) {
    try {
        const cereri = await Cerere.findAll({
            where: { professor_id: profesor_id },
            attributes: ['id','title','message','student_id','signed_by_professor','signed_by_student','status_acceptare_profesor']
        });   
        return cereri.map(cerere => cerere.dataValues);
        
    } catch (error) {
        console.error('Error fetching cereri:', error);
        return false;
    }
}
//insereaza titlul si mesajul cererii
async function insertTitleAndMessage(titlul,mesaj,idProfesor, id) {
    try {
        console.log('Inserting title and message:', titlul, mesaj, idProfesor, id);
        const newCerere = await Cerere.create({
          title: titlul,
          message: mesaj,
          professor_id: idProfesor,
          student_id: id,
          status_acceptare_profesor: 'pending',
        });
        if(!newCerere) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error updating cerere:', error);
        return false;
    }
}

//returnezaza id urile de profesor de cereri pentru un id de student
async function getCereriProfesorIds(studentId) {
   try {
    const cereri = await Cerere.findAll({
        where: { student_id: studentId },
        attributes: ['professor_id']
    });
    const ids = cereri.map(cerere => cerere.dataValues.professor_id);
    return ids;
  } catch (error) {
    console.error('Error fetching cereri:', error);
    return false;
  }
}
//sterge cererea cu id ul specificat
async function stergeCerereDupaId(idCerere) {
    try {
      const rezultat = await Cerere.destroy({
        where: { id: idCerere },
      })
      if(rezultat) {
        return true;
      }
      return false;
        
    }catch(error) {
      console.log("Error deleting row: " + error);
      return false;
    }
}
//stergem cand a acceptat
async function stergeCerereDupaIdStudent(student_id) {
  try {
    const rezultat = await Cerere.destroy({
      where: {
        student_id: student_id,
        status_acceptare_profesor: 'pending'
      },
    })
    if(rezultat) {
      return true;
    }
    return false;
      
  }catch(error) {
    console.log("Error deleting row: " + error);
    return false;
  }
}
//actualizeaza cerererea aprobata a profului
async function actualizeazaStatusAprobareProfesor(idCerere){
  try {
    const rezultat = await Cerere.update(
      { status_acceptare_profesor: "accepted" },
      { where: { id: idCerere } }
    );
    if(rezultat[0] === 1) {
      const idStudent = await Cerere.findOne({
        where :{id : idCerere},
        attributes : ['student_id']
      });
      return idStudent;
    }
    return false;
  }catch(error) {
    return false;
  }
}

async function actualizeazaPdf(student_id,pdfBuffer) {
  try {

    const [numRowsUpdated] = await Cerere.update(
      { fisier_pdf: pdfBuffer,
        signed_by_student : true
      },
      { where: { student_id } }
    );

    if (numRowsUpdated === 0) {
      console.error(`Cerere pentru student_id ${student_id} nu a fost găsită.`);
      return false;
    }
    return true
  } catch (error) {
    console.error('Eroare la actualizarea PDF-ului:', error);
    return false;
  }
}
async function getPdf(idCerere) {
  try {
    console.log(idCerere);
    const cerere = await Cerere.findOne({
      where: { id: idCerere },
      attributes: ['fisier_pdf','title'],
    });


    if (!cerere || !cerere.fisier_pdf) {
      throw new Error('Fișierul PDF nu a fost găsit.');
    }
    return {fisier_pdf: cerere.fisier_pdf, title : cerere.title};
  } catch (error) {
    console.error('Eroare la obținerea fișierului PDF:', error);
    throw error; // Aruncăm eroarea pentru a fi gestionată la nivelul apelantului
  }
}
module.exports = {
  Cerere,
  getCereriDupaId,
  insertTitleAndMessage,
  getCereriProfesor,
  getCereriProfesorIds,
  stergeCerereDupaId,
  actualizeazaStatusAprobareProfesor,
  stergeCerereDupaIdStudent,
  actualizeazaPdf,
  getPdf
};