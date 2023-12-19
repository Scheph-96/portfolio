const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    tagInfo: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = {
    ExperienceFavorite: mongoose.model('ExperienceFavorite', experienceSchema, 'experience_favorite'),
    Experience: mongoose.model('Experience', experienceSchema, 'experience')
}