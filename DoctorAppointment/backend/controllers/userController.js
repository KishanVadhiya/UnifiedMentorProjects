import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET
      
    );

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET   
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 

    const listAppointment = async (req, res) => {
      try {
        const userId = req.user?._id || req.body.userId; // Prefer token-based authentication
        if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }
          const appointments = await appointmentModel.find({ userId})
              .populate('userId', 'name image age')  // Populate user details
              .populate('docId', 'name email image speciality degree experience fees address') // Populate doctor details
              .exec();
  
          res.status(200).json(appointments);
      } catch (error) {
          console.error("Error fetching appointments:", error);
          res.status(500).json({ message: error.message });
      }
  };
  
  const cancelAppointment = async (req, res) => {
    try {
      const { userId, appointmentId } = req.body;
  
      // Fetch the appointment data
      const appointmentData = await appointmentModel.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
  
      // Ensure only the user who booked the appointment can cancel it
      if (appointmentData.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized action" });
      }
  
      // Update appointment status to cancelled
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
  
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
  
      return res.json({ success: true, message: "Appointment Cancelled" });
  
    } catch (error) {
      console.error("Error canceling appointment:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

export { registerUser, loginUser, getProfile, updateProfile,bookAppointment,listAppointment,cancelAppointment };
