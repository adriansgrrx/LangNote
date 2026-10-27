import User from '../src/models/User.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists, authorization denied" });
            }

            return next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: "Not authorized, token invalid or expired" });
        }
    }
    return res.status(401).json({ message: "Not authorized, no token provided" });
}