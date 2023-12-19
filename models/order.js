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
            console.log('DA Description TOP: ', this.description);
            console.log('DA Specififcations: ', this.Specififcations);
            console.log('CHECKIN DES TOP: ', !this.description);
            return !this.description;
            // return 1 === 1;
        }, 'Specififcations is required'],
    },
    description: {
        type: String,
        // validate: {
        //     validator: (data) => {
        //         console.log('THE WAY IT IS: ', data.trim().length !== 0);
        //         return data.trim().length !== 0;
        //     },
        //     message: props => `Description is required`
        // },
        required: [function() { 
            console.log('DA Description: ', this.description);
            console.log('DA Specififcations BOTTOM: ', this.Specififcations);
            console.log('CHECKIN SPEC: ', this.specifications);
            console.log('CHECKIN SPEC LENGTH: ', this.specifications.length);
            console.log('CHECKIN SPEC NULL CHECK: ', this.specifications == null);
            console.log('CHECKIN DES: ', !this.description);
            console.log('CHECKIN DES LENGTH: ', this.description.length);
            console.log('CHECKIN BOTH: ', this.specifications == null && !this.description);
            console.log('TRIM CHECK: ', this.description.trim().length);
            console.log('TRIM VALID CHECK: ', this.description.trim().length === 0);
            console.log('TRIM VALID CHECK AND DES: ', !this.description || this.description.trim().length === 0);
            console.log('ULTIMATE CHECK: ', !this.specifications && (!this.description || this.description.trim().length === 0));
            // return !this.specifications && !this.description;
            return !this.specifications && (!this.description || this.description.trim().length === 0);
            // if (!this.specifications && (!this.description || this.description.trim().length === 0)) {
            //     console.log('RESTURNING TRUE');
            //     return true;
            // } else {
            //     console.log('RETURNIN FALSE');
            //     return false;
            // }
            // return 1 === 1;
        }, 'Description is required']
    },
    created: {
        type: Date,
        default: Date.now(),
        required: true,
    }
});

// const date = new Date();

// arg1: Model Name
// arg2: Schema
// arg3: collection name in the database
module.exports = mongoose.model('Order', orderSchema, 'order');