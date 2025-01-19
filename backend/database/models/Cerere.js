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
        console.error('Error fetching cerere:', error);
    }
}

module.exports = {
  Cerere,
  getCerereDupaId
};