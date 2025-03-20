import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
        // Attempt to extract the token from the 'Authorization' header or other custom headers
        const dtoken = req.headers["authorization"]?.split(" ")[1] || req.headers["dtoken"] || req.headers["Dtoken"];
        
        if (!dtoken) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again doctor" });
        }

        // Verify the token
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        
        // Optionally, attach decoded information to the request body
        req.body.docId = token_decode.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in authDoctor middleware:", error);
        // Return a proper error message and status code
        return res.status(400).json({ success: false, message: "Invalid or expired token", error: error.message });
    }
};

export default authDoctor;
