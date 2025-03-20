import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// console.log("Cloudinary Configuration Before Setup:", cloudinary.config());

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,   // ✅ Remove quotes
    api_key: process.env.CLOUDINARY_API_KEY,   // ✅ Remove quotes
    api_secret: process.env.CLOUDINARY_SECRET_KEY, // ✅ Remove quotes
  });
  
//   console.log("Cloudinary Configuration After Setup:", cloudinary.config());
//   console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
// console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
// console.log("CLOUDINARY_SECRET_KEY:", process.env.CLOUDINARY_SECRET_KEY);

};

export default connectCloudinary;
