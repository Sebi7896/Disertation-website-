const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");


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
  });

  async function getAllProfesors(Facultate,Specializare) {
    try {
      const professors = await Professor.findAll({
        where: {
          facultate: Facultate,
          specializare: Specializare
        },
        attributes : ['id','nume', 'prenume', 'remainingStudents']
      });  
      return professors.map(professor => professor.dataValues);
    } catch (error) {
      console.error('Error fetching professors:', error);
      throw error;
    }
  }
module.exports ={ 
  Professor
  ,getAllProfesors};