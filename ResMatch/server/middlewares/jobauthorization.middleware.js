const JobOpening = require('../models/JobOpening.model.js');

const jobAuthorizationMiddleware = async (req,res,next)=>{

    const job= req.job;
    if(!(req.userId.equals(job.posted_by))){
        return res.status(401).json({message:"You are not authorized to access this job"});
    }
    
    next();
};

module.exports=jobAuthorizationMiddleware;