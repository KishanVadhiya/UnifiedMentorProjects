const express= require('express');
const {getJobOpenings, createJobOpening,getJobById} = require('../controllers/jobopening.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const jobAuthorizationMiddleware = require('../middlewares/jobauthorization.middleware.js');
const jobExistsMiddleware = require('../middlewares/jobexists.middleware.js');
const router = express.Router();

router.get('/',authMiddleware,getJobOpenings);
router.get('/:jobId',authMiddleware,jobExistsMiddleware,jobAuthorizationMiddleware,getJobById);
router.post('/',authMiddleware,createJobOpening);

module.exports= router;