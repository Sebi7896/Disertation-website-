const { Sequelize, DataTypes, where } = require("sequelize");
const sequelize = require("../config/database.js");
const { Op } = require('sequelize');
const Cerere = require("./Cerere.js");
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
  async function getAllProfesorsAvailable(facultate,specializare,cereriDejaFacuteDeProfi) {
    try {
      const professors = await Professor.findAll({
        where: {
          facultate: facultate,
          specializare: specializare,
          professor_id: {
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
module.exports ={ 
  Professor
  ,getAllProfesorsAvailable
  ,getProfessorById};