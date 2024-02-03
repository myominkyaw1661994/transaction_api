const sequelize = require('../database/db');
const _ = require('lodash');
let Pusher = require('pusher');

class NotificationController {
    NotifyingUser(message) {
        console.log("Transaction Notfication.")
        // let pusher = new Pusher({
        //     appId: process.env.PUSHER_APP_ID,
        //     key: process.env.PUSHER_APP_KEY,
        //     secret: process.env.PUSHER_APP_SECRET,
        //     cluster: process.env.PUSHER_APP_CLUSTER
        // });

        // pusher.trigger('Transaction Notification', message, req.headers['x-socket-id']);
    }    
}

module.exports = NotificationController;
