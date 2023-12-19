const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    pic: {
        path: {
            type: String,
            default: 'uploads/recommendations_pic/coder.png',
        },
        extension: {
            type: String,
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
        required: true,
    },
    date: {
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