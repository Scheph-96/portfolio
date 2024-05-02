const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    notify: {
        type: Boolean,
    },
    type: {
        type: "String",
    },
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = mongoose.model('Notification', notificationSchema, 'notification');


