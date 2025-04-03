const resumeSchema = require('../models/Resume.model.js');
const geminiParser = require('../utils/geminiParsing.js');
const drive = require('../config/drive.config.js');
const sendEmail= require('../utils/sendEmail.js');
const pdfParse = require('pdf-parse');
const createFolderIfDontExists = require('../utils/createFolderIfDontExists.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }
        const { jobId } = req.params;
        const {name,email} = req.body;
        //create folder
        const folderId = await createFolderIfDontExists(jobId);
        

        // upload to gdrive
        const uniqueName = `${Date.now()}-${req.file.originalname}`;
        const { data: uploadedFile } = await drive.files.create({
            resource: {
            name: uniqueName,
            parents: [folderId],
            },
            media: {
            mimeType: 'application/pdf',
            body: fs.createReadStream(req.file.path),
            },
            fields: 'id,webViewLink',
        });


        await drive.permissions.create({
            fileId: uploadedFile.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        
        const dataBuffer = fs.readFileSync(req.file.path);
        const { text: extractedText } = await pdfParse(dataBuffer);  

        fs.unlinkSync(req.file.path);
        
        const parsed_data = await geminiParser(true,extractedText,req.job.parsed_description);

        const resume = new resumeSchema({
            name,
            email,
            job_opening_id:jobId,
            resume_url: uploadedFile.webViewLink,
            parsed_data,
        });

        await resume.save();

        await sendEmail(email,name,req.job.company);

        res.status(200).json({
            success: true,
            message: 'PDF uploaded successfully',
        });

    } catch (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to upload PDF',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}

const getAllResume = async (req, res) => {
    const jobId= req.params.jobId;
    const {matchingExp, matchingEd, matchingSkills, sortByExp, sortByPSkills} = req.query;
    try{
        let resumes= await resumeSchema.find({job_opening_id:jobId});

        if(matchingExp){
            resumes=resumes.filter((val) => val?.parsed_data?.job_matching?.matching_required_experience);
        }

        if(matchingEd){
            resumes=resumes.filter((val) => val?.parsed_data?.job_matching?.matching_required_education);
        }
        
        if(matchingSkills){
            resumes=resumes.filter((val) => (val?.parsed_data?.job_matching?.num_missing_required_skills==0));
        }

        if(sortByExp){
            resumes.sort((a,b)=> b?.parsed_data?.total_experience - a?.parsed_data?.total_experience);
        }

        if(sortByPSkills){
            resumes.sort((a,b) => b?.parsed_data?.job_matching?.num_matched_preferred_skills - a?.parsed_data?.job_matching?.num_matched_preferred_skills);
        }

        return res.status(200).json({resumes});
    }catch(err){
        return res.status(500).json({"message":"Cannot Fetch"});
    }
}

const getResumeById = async(req,res) =>{
    try{
        const jobId= req.params.jobId;
        const resumeId=req.params.resumeId;

        const resume= await resumeSchema.find({_id:resumeId});

        if(!resume){
            return res.status(404).json({"message":"Not Found"});
        }

        return res.status(200).json(resume);
    }catch(err){
        return res.status(500).json({"message":"Cannot Fetch"});
    }
}

module.exports = {
    uploadResume,
    getAllResume,
    getResumeById
};