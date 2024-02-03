const sequelize = require('../database/db');
const User = require('../models/user');
const Account = require('../models/account');
const _ = require('lodash');

class UserController {

    async getUsers(pageNumber = 1, itemsPerPage = 10) {
        const offset = (pageNumber - 1) * itemsPerPage;
        const users = await User.findAll({raw: true,  offset: offset, limit: itemsPerPage, attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']});
        return users;
    }

    async getUsersById(id) {
        const user = await User.findOne({raw: true, where : {id : id}, attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']});
        return [user];
    }

    async createUser(users) {
        const user = await User.create({name: users.name, email: users.email, password: users.password});
        const account = await Account.create({userId: user.id, amount: 10000});
        return user;
    }

    async updateUser(id, user) {
        const result = await User.update(user, {
            where: {
              id: id,
            },
          });

        return result;
    }

    async deleteUser(id) {
        const user = await User.destroy({
          where: {id : id}
        });

        return user;
    }
}

module.exports = UserController;
