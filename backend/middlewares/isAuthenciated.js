import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        // Ensure token is extracted from cookies
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded?.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Find user and attach to request (excluding password)
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default isAuthenticated;




/*import jwt from "jsonwebtoken";

const isAuthenciated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Correctly access cookies
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
        req.id = decode.userId; // Pass decoded user ID to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export default isAuthenciated;*/



/*import jwt from "jsonwebtoken";

const isAuthenciated =async (req,res,next)=>{
    try{
        const token =req.cookie.token;
        if(!token){
            return res.status(401).json({
                message:"User not authenciated",
              
                success:false,
            });
        }
        const decode =await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invaliid token",
              
                success:false,
            });
        };
        req.id =decode.userId;
        next();
    }catch (error){
            console.log(error);
        }
    }
    
export default isAuthenciated;*/