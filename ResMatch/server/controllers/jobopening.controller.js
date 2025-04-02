const JobOpening = require('../models/JobOpening.model.js');
const geminiAPI = require('../utils/geminiParsing.js');
const getJobOpenings = async (req,res) =>{
    const userId=req.userId;
    try {
        const jobOpenings = await JobOpening.find({ posted_by: userId });
        res.status(200).json(jobOpenings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job openings', error });
    }

}

const createJobOpening = async (req,res) =>{
    const { job_title,company, description} = req.body;
    console.log("Inside controller");
    console.log(req.userId);
    if (!job_title || !description || !company) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const parsed_description = await geminiAPI(false,description);

    try {
        if(!parsed_description){
            throw "cannot parse the job description";
        }

        const newJobOpening = new JobOpening({
            posted_by: req.userId,
            company,
            job_title,
            description,
            parsed_description,
        });

        const savedJobOpening = await newJobOpening.save();
        res.status(201).json(savedJobOpening);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job opening', error });
    }
}

const getJobById = async(req,res)=>{
    return res.status(200).json(req.job);
}

module.exports = {
    getJobOpenings,
    createJobOpening,
    getJobById,
};