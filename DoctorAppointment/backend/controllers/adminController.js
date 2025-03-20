import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        console.log("Received request to add doctor:", req.body);

        // Check for missing fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password should be at least 6 characters long" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure image is uploaded
        let imageUrl = "";
if (imageFile) {
    console.log("Uploading image to Cloudinary...");
    try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        console.log("Cloudinary Response:", imageUpload);
        if (!imageUpload || !imageUpload.secure_url) {
            return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }
        imageUrl = imageUpload.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ success: false, message: "Error uploading image to Cloudinary", error: error.message });
    }
} else {
    return res.status(400).json({ success: false, message: "Image is required" });
}

        

        // Ensure address is properly formatted
        let formattedAddress;
        try {
            formattedAddress = JSON.parse(address);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        // Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(409).json({ success: false, message: "Doctor with this email already exists" });
        }

        // Create new doctor object
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: formattedAddress,
            date: Date.now()
        };

        // Save to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: "Doctor Added Successfully!" });
    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//api for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email===process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token =jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
    const allDoctors=async(req,res)=>{
        try {
            const doctors=await doctorModel.find({}).select('-password')
            res.json({success:true,doctors})
        } catch (error) {
            console.error("Error in alladdDoctor:", error);
        res.status(500).json({ success: false, message: error.message });
        }
    }
   const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find()
            .populate("userId", "name email image dob phone gender address") // Fetching required fields
            .populate("docId", "name email image speciality degree experience about fees available");

        // console.log("Fetched Appointments:", appointments);

        const formattedAppointments = appointments.map(appointment => {
            let parsedUserData = {};

            try {
                parsedUserData = typeof appointment.userData === "string"
                    ? JSON.parse(appointment.userData)
                    : appointment.userData;
            } catch (error) {
                console.error("Error parsing userData:", error);
            }

            return {
                ...appointment._doc,
                userData: parsedUserData && parsedUserData._id
                    ? {
                          _id: parsedUserData._id,
                          name: parsedUserData.name || "Unknown",
                          email: parsedUserData.email || "Not Provided",
                          image: parsedUserData.image || "",
                          gender: parsedUserData.gender || "N/A",
                          dob: parsedUserData.dob || "N/A",
                          phone: parsedUserData.phone || "N/A",
                          address: parsedUserData.address || {},
                      }
                    : { name: "Unknown", image: "", age: "N/A" },

                docData: appointment.docId
                    ? {
                          _id: appointment.docId._id,
                          name: appointment.docId.name || "Not Available",
                          email: appointment.docId.email || "Not Provided",
                          image: appointment.docId.image || "",
                          speciality: appointment.docId.speciality || "N/A",
                          degree: appointment.docId.degree || "N/A",
                          experience: appointment.docId.experience || "N/A",
                          about: appointment.docId.about || "N/A",
                          available: appointment.docId.available,
                          fees: appointment.docId.fees || "N/A",
                      }
                    : { name: "Not Available", fees: "N/A" },
            };
        });

        // console.log("Formatted Appointments:", formattedAppointments);

        res.json({ success: true, appointments: formattedAppointments });
    } catch (error) {
        console.error("Error in allAppointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch the appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Update appointment status to cancelled
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { cancelled: true },
            { new: true } // Returns the updated document
        );

        // Fetch doctor details
        const doctorData = await doctorModel.findById(appointmentData.docId);
        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Remove the booked slot from the doctor's schedule
        const { slotDate, slotTime } = appointmentData;
        let slots_booked = doctorData.slots_booked || {};

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);

            // If no more slots are booked for that date, delete the entry
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
        }

        // Update doctor slots
        await doctorModel.findByIdAndUpdate(appointmentData.docId, { slots_booked });

        return res.json({ success: true, message: "Appointment cancelled successfully", appointment: updatedAppointment });

    } catch (error) {
        console.error("Error canceling appointment:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});  // Fetch all doctors
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({}).populate('docId', 'name image');
        
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



      
    
export { addDoctor,loginAdmin ,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard};
