const sequelize = require("../config/database.js");
const Utilizator = require("./Utilizator.js");
const Token = require("./Token.js"); 
const Student = require("./Student.js");
const Profesor = require("./Profesor.js");
const Cerere = require("./Cerere.js");


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync({ force: false }); 
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Închide conexiunea
    await sequelize.close();
  }
})();
