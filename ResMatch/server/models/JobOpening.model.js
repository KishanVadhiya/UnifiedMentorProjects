const mongoose = require('mongoose');

const JobOpeningSchema = new mongoose.Schema({
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    company:{
        type: String,
        required: true,
    },
    job_title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    parsed_description:{
        type: Object,
        required: true,
    },
    created_at:{
        type: Date,
        default: Date.now(),
    }
});

module.exports=mongoose.model('job_openings',JobOpeningSchema);