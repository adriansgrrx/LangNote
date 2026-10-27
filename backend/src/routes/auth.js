import express from 'express';
import User from '../models/User.js';
import { protect } from '../../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }
        
        const userExist = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (userExist) {
            const message = userExist.email === email 
                ? 'Email already in use' 
                : 'Username already taken';
            return res.status(400).json({ message });
        }
        
        const user = await User.create({username, email, password});
        const token = generateToken(user._id);
        
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
    } catch (error) {
        console.error("Register error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'Username or email';
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(500).json({
            message: "Server error"
        })
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({message: 'Please fill all the fields'});
        }
        
        const user = await User.findOne({email});
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({message: 'Invalid credentials'});
        } 
        
        const token = generateToken(user._id);
        
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
})

router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user)
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

export default router;