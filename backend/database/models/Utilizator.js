const { Sequelize } = require("sequelize");
const sequelize = require("../config/database.js");
const bcrypt = require('bcrypt');

const Utilizator = sequelize.define('Utilizatori', {  
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('student', 'professor'),
    allowNull: false
  },
}, {
  freezeTableName: true, 
  timestamps : false
});



module.exports = Utilizator;
