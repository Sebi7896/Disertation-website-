const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const { get } = require("../../routes/StudentRoutes/chooseTeacher.js");

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
    }
  }, {
    timestamps: false,
    freezeTableName: true
});

async function getCerereDupaId(studentId) {
    try {
        const cerere = await Cerere.findOne({
            where: { student_id: studentId }
        });
        return cerere.dataValues;
    } catch (error) {
        return false;
    }
}

async function updateTitleAndMessage(titlul,mesaj,id) {
    try {
        const rowsAffected =  await Cerere.update({
            title: titlul,
            message: mesaj
        }, {
            where: { id: id },
            returning: true,
        });
        if(rowsAffected[0] != 1) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error updating cerere:', error);
        return false;
    }
}

async function getAcceptareProfesorStatus(studentId) {
  try {
      const cerere = await Cerere.findOne({
          where: { studentId: studentId }
      });
      return cerere.dataValues.status_acceptare_profesor;
  } catch (error) {
      return false;
  }
  
}

module.exports = {
  Cerere,
  getCerereDupaId,
  updateTitleAndMessage
};