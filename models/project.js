const mongoose = require('mongoose');
const ProjectType = require('./project_type');

projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    },
    customer: {
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
        }
    },
    info: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ProjectType,
        default: ProjectType.NEW.value
    }
});

module.exports = mongoose.model('Project', projectSchema);