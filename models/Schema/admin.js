const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: [true, 'Provide a password']
    },
    username: {
        type: String,
    },
    online: {
        type: Boolean,
    }
});

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = mongoose.model('Admin', adminSchema, 'admin');


