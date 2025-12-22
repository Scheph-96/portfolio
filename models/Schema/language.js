const mongoose = require('mongoose');

languageSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Language', languageSchema, 'language');