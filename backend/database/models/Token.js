const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");


const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Constrângere de unicitate
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Utilizatori', // Numele tabelei `Utilizatori` în baza de date
      key: 'id'
    },
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false // Tokenul trebuie să aibă o dată de expirare definită
  }
}, {
  timestamps: false, // Dezactivează coloanele createdAt și updatedAt
  indexes: [
    {
      fields: ['token'],
      unique: true, 
    },
    {
      fields: ['user_id', 'expires_at'], // Index compus pentru căutare rapidă
    }
  ]
});



module.exports = Token;