const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    pic: {
        path: {
            type: String,
            default: 'uploads/recommendations_pic/coder.png',
        },
        extension: {
            type: String,
            default: 'png'
        },
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        default: 0,
        required: true,
    },
    date: {
        // This attribute will hold the formatted date that will
        // be displated on the view
        type: String
    },
    created: {
        type: Date,
        default: Date.now(),
        required: true,
    }
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = {
    RecommendationFavorite: mongoose.model('RecommendationFavorite', recommendationSchema, 'recommendation_favorite'),
    Recommendation: mongoose.model('Recommendation', recommendationSchema, 'recommendation')
}