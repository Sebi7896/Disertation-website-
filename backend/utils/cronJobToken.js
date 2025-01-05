const cron = require('node-cron');
const  Token  = require('../database/models/Token'); // Asigură-te că calea către model este corectă
const Sequelize = require('sequelize');

cron.schedule('0 0 * * *', async () => {    
    try{
      // Șterge token-urile care au expirat
      const result = await Token.destroy({
        where: {
          expires_at: { [Sequelize.Op.lt]: new Date() }
        }
      });
  
      console.log(`Deleted ${result} expired refresh tokens.`);
    } catch (error) {
    console.error('Error cleaning expired refresh tokens:', error);
  }
});
