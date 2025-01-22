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
      attributes: ['id','title','message','professor_id','status_acceptare_profesor','signed_by_professor','signed_by_student']
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
///actualizeaza pdf in baza de date  pt student 
async function actualizeazaPdfStudent(student_id,pdfBuffer) {
  try {
    const [numRowsUpdated] = await Cerere.update(
      { fisier_pdf: pdfBuffer,
        signed_by_student : true
      },
      { where: { student_id } }
    );
    if (numRowsUpdated === 0) {
      console.error(`request not found!.`);
      return false;
    }
    return true
  } catch (error) {
    console.error('Eroare la actualizarea PDF-ului:', error);
    return false;
  }
}
//actualizeaza pentru profesor
async function actualizeazaPdfProfesor(idCerere,pdfBuffer) {
  try {
    const [numRowsUpdated] = await Cerere.update(
      { fisier_pdf: pdfBuffer,
        signed_by_professor : true
      },
      { where: { id : idCerere } }
    );
    if (numRowsUpdated === 0) {
      console.error(`request not found!`);
      return false;
    }
    return true
  } catch (error) {
    console.error('Eroare la actualizarea PDF-ului:', error);
    return false;
  }
}
//returneaza pdf
async function getPdf(idCerere) {
  try {
    console.log(idCerere);
    const cerere = await Cerere.findOne({
      where: { id: idCerere },
      attributes: ['fisier_pdf', 'title'],
    });

    if (!cerere || !cerere.fisier_pdf) {
      throw new Error('Fișierul PDF nu a fost găsit.');
    }

    const pdfBuffer = Buffer.isBuffer(cerere.fisier_pdf)
      ? cerere.fisier_pdf
      : Buffer.from(cerere.fisier_pdf, 'base64');

    return { pdfBuffer, title: cerere.title };
  } catch (error) {
    console.error('Eroare la obținerea fișierului PDF:', error);
    throw error; 
  }
}
//atribute pentru cerere 
async function getStats(idCerere) {
  try {
    const cerere = await Cerere.findOne({
      where: { id: idCerere }, // Filtrare după idCerere
      attributes: [
        'title',
        'message',
        'signed_by_student',
        'student_id'
      ],
    });

    if (!cerere) {
      return { error: 'Cererea nu a fost găsită.' };
    }

    return cerere; // Returnează obiectul găsit
  } catch (error) {
    console.error('Eroare la extragerea cererii:', error);
    throw new Error('Eroare la obținerea statisticilor cererii.');
  }

}
async  function getProfessorIdByRequestId(idCerere) {
  try {
    const cerere = await Cerere.findOne({
      where: { id: idCerere },
      attributes: [
        'professor_id'
      ],
    });

    return cerere.professor_id;
  } catch (error) {
    console.error('Eroare la obținerea ID-ului profesorului:', error);
    throw error;
  }
};
//sterge cererile ca nu mai are remaining students
async function stergeCereriInPendingProfesor(id_profesor) {
  try {
    const numarCereriiSterse = await Cerere.destroy({
      where: {
        professor_id: id_profesor,
        status_acceptare_profesor: 'pending',
      },
    });

    console.log(`Cererile șterse: ${numarCereriiSterse}`);
    return numarCereriiSterse;
  } catch (error) {
    console.error("Eroare la ștergerea cererilor:", error);
    throw error;
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
  actualizeazaPdfStudent,
  actualizeazaPdfProfesor,
  getPdf,
  getStats,
  getProfessorIdByRequestId,
  stergeCereriInPendingProfesor
};