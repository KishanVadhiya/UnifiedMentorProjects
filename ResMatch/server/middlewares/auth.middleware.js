const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js"); 
require('dotenv').config();
const authMiddleware = async (req, res, next) => {
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

        req.userId = userId; 
        next(); 
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;