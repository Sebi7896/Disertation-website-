const { Sequelize, DataTypes, where } = require("sequelize");
const sequelize = require("../config/database.js");
const { Op } = require('sequelize');
const {Cerere,stergeCereriInPendingProfesor} = require("./Cerere.js");
const { use } = require("../../routes/tokenData.js");
const Professor = sequelize.define('Profesori', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Utilizatori',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    nume: {
        type:Sequelize.STRING,
        allowNull : false
    },
    prenume:{
        type:Sequelize.STRING,
        allowNull : false
    },
    facultate: {
      type: Sequelize.STRING,
      allowNull: false
    },
    specializare: {
      type: Sequelize.STRING,
      allowNull: false
    },
    remainingStudents: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  },
  {
    modelName: 'Profesor',
    tableName: 'Profesori'
});

//returneaza profesorii disponibili pentru un student (fara cei pe care i a ales)
  async function getAllProfesorsAvailable(facultate,specializare,cereriDejaFacuteDeProfi) {
    try {
      const professors = await Professor.findAll({
        where: {
          facultate: facultate,
          specializare: specializare,
          id: {
            [Op.notIn]: cereriDejaFacuteDeProfi,
          },
        },
        attributes: ['id', 'nume', 'prenume', 'remainingStudents'], 
      })
      return professors.map(professors => professors.dataValues);
    } catch (error) {
      console.error('Error fetching professors:', error);
      throw error;
    }
  }
  //returneaza toate datele profului
  async function getProfessorById(professorId) {  
    try {
      const professor = await Professor.findOne({
        where: { id: professorId }
      });
      return professor;
    }catch (error) {
      console.error('Error fetching professor:', error);
      throw error;
    }
  }
  //ret facultatea si specializarea profului
  async function getProfesorFacultateSpecializare(profesor_id) {
      const prof = await Professor.findOne({
            where: {
                id: profesor_id
            },
            attributes: ['facultate', 'specializare']
          });
      return prof.dataValues; 
  }
  //returneaza datele profesorului user ului
  async function getProfesorById(user_id) {
    const profesor =await Professor.findOne({
      where : {
        user_id : user_id
      },
      attributes : ['id','nume','prenume','remainingStudents']
    });
    return profesor.dataValues;
  }
  //actualizeaza studentii ramasi dupa aprobarea unui student
  async function scadeStudentAprobatDupaIdCerere(id_profesor) {
    try {
      const professor = await Professor.findOne({
        attributes: ['remainingStudents'],
        where: { id: id_profesor },
      });
      const rowsAffected = await Professor.update(
        { remainingStudents: professor.remainingStudents - 1 },
        { where: { id: id_profesor } }
      );
      if(professor.remainingStudents -1 === 0) {
        //sterge cererile care sunt in pending
        await stergeCereriInPendingProfesor(id_profesor);
      }


      if (rowsAffected[0] === 0) {
        return { success: false, message: 'Nicio cerere actualizată sau numărul de studenți este deja 0.' };
      }
  
      return { success: true, message: 'Numărul de studenți a fost actualizat cu succes.' };
    } catch (error) {
      console.error('Eroare la actualizarea numărului de studenți:', error);
      throw new Error('Eroare internă la actualizarea cererii.');
    }
  }


module.exports ={ 
  Professor
  ,getAllProfesorsAvailable
  ,getProfessorById
  ,getProfesorFacultateSpecializare
  ,getProfesorById,
  scadeStudentAprobatDupaIdCerere
};