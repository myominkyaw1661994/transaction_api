const sequelize = require('../database/db');
const User = require('../models/user');
const Account = require('../models/account');
const _ = require('lodash');

class AccountController {
    
    async createAccount(account) {
        const created_account = await Account.create({userId: account.userId, amount: account.amount});
        return created_account;
    }

    async updateAccount(id, account) {
        const result = await Account.update(account, {
            where: {
              id: id,
            },
          });

        return result;
    }

    async deleteAccount(id) {
        const account = await Account.destroy({
            where: {id : id}
          });
  
          return account;
    }
}

module.exports = AccountController;
