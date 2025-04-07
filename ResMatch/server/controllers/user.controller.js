const User = require('../models/User.model.js');
const jwt=require('jsonwebtoken');
const bcrypt= require('bcrypt');
require('dotenv').config();

const register = async (req,res) => {
    try{

        const {name,email,company,password} = req.body;
        
        const existingUser = await User.findOne({email});
        
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        
        if(!name || !email || !password){
            return res.status(400).json({message: "missing items"});
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = new User({
            name,
            email,
            company,
            password:hashedPassword
        });
        
        await user.save();

        return res.status(201).json({message:"User Regitered Successfully"});
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error:err});
    }
    
}

const login = async(req,res) =>{
    console.log("Inside login");
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"missing email or password"});
        }

        const user= await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"invalid credentials"});
        }

        const isPasswordValid= await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({message:"invalid credentials"});
        }

        const token = jwt.sign({_id:user._id ,name:user.name, email:user.email}, process.env.SECRET_KEY, {expiresIn: '30d'});

        return res.status(200).json({user:token});

    }catch(err){

    }
}

const verify = async (req,res)=>{
    const token = req.header("Authorization");
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
    
        try {
    
            const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY);
    
            const user = await User.findOne({ _id: decoded._id});
            const userId=user._id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized: User not found." });
            }
    
            return res.status(200).json({
                userId:user._id,
                name:user.name,
                email:user.email,
                company: user.company,
            })
        } catch (error) {
            res.status(400).json({ message: "Invalid or expired token." });
        }
}

module.exports= {
    register,
    login,
    verify,
};