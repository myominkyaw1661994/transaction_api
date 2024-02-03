const sequelize = require('../database/db');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const NotificationController = require('../controller/NotificationController');
const _ = require('lodash');

class TransactionController {
    
    async createTransaction(transaction) {
        const amount = transaction.amount;
        let from = await Account.findOne({raw: true, where: {userId : transaction.from_user_id}})
        let to = await Account.findOne({raw: true, where: {userId : transaction.to_user_id}})

        const t = await sequelize.transaction();

        try {
          const newtransaction = await Transaction.create({from_user_id: transaction.from_user_id, to_user_id: transaction.to_user_id, amount: transaction.amount})
          await Account.update({amount : from.amount - amount},  { where: { userId : transaction.from_user_id}});
          await Account.update({amount : to.amount + amount},  { where: { userId : transaction.to_user_id}});
          await t.commit();

          const notificationController = new NotificationController();
          await notificationController.NotifyingUser();
          return [{status: "success", messsage: "Transaction create successfully.", transaction_id: newtransaction.id}]
          
        } catch (error) {
          console.log(error);
          await t.rollback();
          return [{status: "failed", messsage: "Fail to transfer"}]
        }
    }

    async getTransactionHistoryByUser(userId, pageNumber = 1, itemsPerPage = 10) {
      const offset = (pageNumber - 1) * itemsPerPage;

      let query = `select t.id, 
                t.from_user_id, 
                from_user.name as from_user, 
                t.to_user_id, 
                to_user.name as to_user, 
                t.amount, 
                t.createdAt, 
                t.updatedAt
              from Transactions t
              join Users from_user ON t.from_user_id = from_user.id
              join Users to_user ON t.to_user_id = to_user.id
              where t.from_user_id = ${userId} || t.to_user_id = ${userId}
              limit ${itemsPerPage} offset ${offset}`; 

      const [results, metadata] = await sequelize.query(query);
      return results;
    }

    async getTransactionInHistoryByUser(userId, pageNumber = 1, itemsPerPage = 10) {
      const offset = (pageNumber - 1) * itemsPerPage;

     let query = `select t.id, 
               t.from_user_id, 
               from_user.name as from_user, 
               t.to_user_id, 
               to_user.name as to_user, 
               t.amount, 
               t.createdAt, 
               t.updatedAt
             from Transactions t
             join Users from_user ON t.from_user_id = from_user.id
             join Users to_user ON t.to_user_id = to_user.id
             where t.to_user_id = ${userId}
             limit ${itemsPerPage} offset ${offset}`; 

     const [results, metadata] = await sequelize.query(query);
     return results;
      
   }

    async getTransactionOutHistoryByUser(userId, pageNumber = 1, itemsPerPage = 10) {
      const offset = (pageNumber - 1) * itemsPerPage;

      let query = `select t.id, 
                t.from_user_id, 
                from_user.name as from_user, 
                t.to_user_id, 
                to_user.name as to_user, 
                t.amount, 
                t.createdAt, 
                t.updatedAt
              from Transactions t
              join Users from_user ON t.from_user_id = from_user.id
              join Users to_user ON t.to_user_id = to_user.id
              where t.from_user_id = ${userId}
              limit ${itemsPerPage} offset ${offset}`; 

      const [results, metadata] = await sequelize.query(query);
      return results;
    }

    async getTransactionDetail(transactionId) {
      let query = `select t.id, 
                t.from_user_id, 
                from_user.name as from_user, 
                t.to_user_id, 
                to_user.name as to_user, 
                t.amount, 
                t.createdAt, 
                t.updatedAt
              from Transactions t
              join Users from_user ON t.from_user_id = from_user.id
              join Users to_user ON t.to_user_id = to_user.id
              where t.id = ${transactionId}`

      const [results, metadata] = await sequelize.query(query);
      return results;
    }
}

module.exports = TransactionController;
