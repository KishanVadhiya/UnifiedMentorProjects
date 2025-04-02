const express = require('express');
require('dotenv').config();
const connectDB=require('./config/db.config.js');
const cors=require('cors');
const app=express();
connectDB();
const port=4000;

//middlewares 

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//routes 
const userRoutes = require('./routes/user.route.js');
const jobopeningRoutes=require('./routes/jobopening.route.js');
const resumeRoutes=require('./routes/resume.routes.js');

// using routes

app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/jobopening',jobopeningRoutes);
app.use('/api/v1/resumes',resumeRoutes);

app.get('/',(req,res)=>{
    res.json({"message":"Welcome to resumatch api"});
})

app.get('*abc',(req,res)=>{
    res.json("Page does not exists");
})
app.listen(port,()=>{
    console.log(`Server running at port ${port}`)
})