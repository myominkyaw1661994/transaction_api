
const sequelize = require('../database/db');
// const {User} = require('./user.js')
const Account = require('./account.js')
const Transaction = require('./transaction.js')

sequelize.sync().then(() => {
   console.log('Database table created successfully!');
}).catch((error) => {
   console.error('Unable to create table : ', error);
});
