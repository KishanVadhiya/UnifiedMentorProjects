const express = require('express');
const upload = require('../config/multer.config.js');
const authMiddleware=require('../middlewares/auth.middleware.js');
const jobAuthorizationMiddleware=require('../middlewares/jobauthorization.middleware.js');
const jobExistsMiddleware = require('../middlewares/jobexists.middleware.js');
const {uploadResume,getAllResume,getResumeById} = require('../controllers/resume.controller.js');
const router=express.Router();

router.post('/:jobId',jobExistsMiddleware,upload.single('pdf'),uploadResume);
router.get('/:jobId/:resumeId',authMiddleware,jobExistsMiddleware,jobAuthorizationMiddleware,getResumeById);
router.get('/:jobId',authMiddleware,jobExistsMiddleware,jobAuthorizationMiddleware,getAllResume);

module.exports=router;