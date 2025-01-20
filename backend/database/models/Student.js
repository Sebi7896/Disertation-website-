const { Sequelize, DataTypes } = require("sequelize");
const Profesor = require("./Profesor.js");
const sequelize = require("../config/database.js");

const Student = sequelize.define('Studenti', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Utilizatori',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }, nume: {
        type:Sequelize.STRING,
        allowNull : false
    },
    prenume:{
        type:Sequelize.STRING,
        allowNull : false
    },
    facultate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specializare: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });

  async function getAllStudents() {
    try {
        // Selectăm toate datele din tabela Studenti
        const students = await Student.findAll();
        const listaStudenti = students.map(student => {
          const { id, nume, prenume, facultate, specializare } = student.dataValues;
          return { id, nume, prenume, facultate, specializare };
        });
        // Afișăm datele în consolă
        console.log(listaStudenti);
        console.log(listaStudenti.filter(student => student.facultate === "Facultatea de Economie"));
    } catch (error) {
        // Dacă apare o eroare, o afișăm
        console.error('Error fetching students:', error);
    }
  }

  async function getStudentById(studentId) {
    try {
        // Selectăm toate datele din tabela Studenti
        const student = await Student.findOne({
          where: {
              user_id: studentId
          }
      });
      const { id, nume, prenume, facultate, specializare } = student.dataValues;
      return {nume, prenume, facultate, specializare };
    }
    catch (error) {
        // Dacă apare o eroare, o afișăm
        console.error('Error fetching student:', error);
    }
  }

  async function getStudentIdByUserId(userId) {
    try {
        // id-ul
        const student = await Student.findOne({
          where: {
              user_id: userId
          },
          attributes: ['id']
      });
      return student.dataValues.id;
    }
    catch (error) {
        console.error('Error fetching student:', error);
    }
  }
  async function getPendingProfesor(userId) {
    try {
        // id-ul
        const student = await Student.findOne({
          where: {
              user_id: userId
          },
          attributes: ['id',"status_acceptare_profesor"]
      });
      const id = student.dataValues.id;
      return id;
    }
    catch (error) {
        console.error('Error fetching student:', error);
    }
  }
  async function getProfesoriDeAlesFacultateSpecializare(student_id,cereriDejaFacuteDeProfi) {
    try {
        
        const student = await Student.findOne({
          where: {
              id: student_id
          },
          attributes: ['facultate', 'specializare']
      });
      
      const { facultate, specializare } = student.dataValues;

      const profesori = await Profesor.getAllProfesorsAvailable(facultate,specializare,cereriDejaFacuteDeProfi);
      return profesori;

    }catch (error) {
        console.error('Error fetching proffesors:', error);
    }
  }
  async function getCreditentials(student_id) {
      try {
        const student = await Student.findOne({
          where: {
            id: student_id
          },
          attributes: ['nume', 'prenume']
        });
        return student;
      }catch(error) {
        console.error('Error fetching proffesors:', error);
      }
  }
module.exports = {
  Student,getAllStudents,
  getStudentById,
  getStudentIdByUserId,
  getPendingProfesor,
  getProfesoriDeAlesFacultateSpecializare,
  getCreditentials
} ;