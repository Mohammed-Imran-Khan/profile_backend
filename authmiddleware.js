import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token is missing" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token is missing or invalid format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//verify jsonwebtoken
        
        
        req.body.email = decoded.email;
        // console.log(req.user);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default auth;
