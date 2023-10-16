const mongoose = require('mongoose');

customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    projectNumber: {
        type: Number,
        required: false,
    },
    totalSpend: {
        type: float,
        required: false,
    },
    registrationDate: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    leavingDate: {
        type: Date,
        required: false,
    }
});

module.exports = mongoose.model('Customer', customerSchema);