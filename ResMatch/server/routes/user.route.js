const express= require('express');
const {register, login,verify} = require('../controllers/user.controller.js');
const router= express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/verify',verify);


module.exports=router;