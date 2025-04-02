const JobOpening = require('../models/JobOpening.model.js');
const mongoose = require('mongoose');
const jobExistsMiddleware = async (req,res,next)=>{
    
    const jobId = req.params.jobId;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ error: "Invalid jobId" });
    }

    const job= await JobOpening.findOne({_id:jobId});

    if(!job){
        return res.status(404).json({message:"No job found"});
    }

    req.job=job;
    next();
};

module.exports=jobExistsMiddleware;