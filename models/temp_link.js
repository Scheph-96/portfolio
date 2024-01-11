const mongoose = require('mongoose');

tempLinkSchema = new mongoose.Schema({
    token: {
        type: mongoose.Schema.Types.UUID,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        expires: 3600,
        required: true
    }
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = mongoose.model('TempLink', tempLinkSchema, 'temp_link')
