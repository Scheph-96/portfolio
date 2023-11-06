const mongoose = require('mongoose');

orderSchema = new mongoose.Schema({
    service: {
        type: String,
        validate: {
            validator: (data) => {
                return /^([a-zA-Z\-]+)$/.test(data);
            },
            message: props => `${props.value} is not a valid service`
        },
        required: true,
    },
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
        validate: {
            validator: (data) => {
                return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(data);
            },
            message: props => `${props.value} is not a valid email`
        },
        required: [true, `Email is required`],
    },
    specifications: {
        type: Boolean,
        required: [function() {
            return !this.description ;
        }, 'Specififcations is required'],
    },
    description: {
        type: String,
        // validate: {
        //     validator: (data) => {
        //         return /^([a-zA-Z0-9_\.\s]+)$/.test(data);
        //     },
        //     message: props => `Please the description does not support some characters`
        // },
        required: [function() { 
            return !this.specifications;
        }, 'Description is required']
    },
    created: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Order', orderSchema, 'order');