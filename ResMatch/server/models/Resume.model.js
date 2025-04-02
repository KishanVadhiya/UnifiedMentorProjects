const mongoose= require('mongoose');

const ResumeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    job_opening_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    resume_url:{
        type: String,
        required: true,
    },
    parsed_data: {
        type: Object,
        required: true,
    },
    submitted_at:{
        type: Date,
        default: Date.now(),
    }
});

module.exports=mongoose.model('resumes',ResumeSchema);