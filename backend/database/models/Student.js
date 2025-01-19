const { Sequelize, DataTypes } = require("sequelize");
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

  async function getStudentByUserId(userId) {
    try {
        // id-ul
        const student = await Student.findOne({
          where: {
              user_id: userId
          },
          attributes: ['id']
      });
      const id = student.dataValues.id;
      return id;
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
module.exports = {
  Student,getAllStudents,
  getStudentById,
  getStudentByUserId,
  getPendingProfesor
} ;