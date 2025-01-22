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
  //returneaza toti studentii
  async function getAllStudents() {
    try {
        const students = await Student.findAll();
        const listaStudenti = students.map(student => {
          const { id, nume, prenume, facultate, specializare } = student.dataValues;
          return { id, nume, prenume, facultate, specializare };
        });
        console.log(listaStudenti);
        console.log(listaStudenti.filter(student => student.facultate === "Facultatea de Economie"));
    } catch (error) {
        console.error('Error fetching students:', error);
    }
  }
  //returneaza un anumit student dupa id-ul lui
  async function getStudentById(studentId) {
    try {
        const student = await Student.findOne({
          where: {
              user_id: studentId
          }
      });
      const { id, nume, prenume, facultate, specializare } = student.dataValues;
      return {nume, prenume, facultate, specializare };
    }
    catch (error) {
        console.error('Error fetching student:', error);
    }
  }
  //returneaza id ul studentului dupa User-ul acestuia
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
  //returneaza  statusul de acceptare si id ul id a unui user student
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
  //returneaza toti profesorii disponibili pe care ii poate alege un student 
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
  //returneaza numele si prenumele studentlui cu id ul sau 
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
  //returneaza facultatea si specializarea studentului cu id sau
  async function getStudentiFacultateSpecializare(student_id) {
    const student = await Student.findOne({
      where: {
          id: student_id
      },
      attributes: ['facultate', 'specializare']
    });
    return student.dataValues; 
  }


module.exports = {
  Student,getAllStudents,
  getStudentById,
  getStudentIdByUserId,
  getPendingProfesor,
  getProfesoriDeAlesFacultateSpecializare,
  getCreditentials,
  getStudentiFacultateSpecializare
} ;