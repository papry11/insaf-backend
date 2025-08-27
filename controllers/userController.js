
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Token create function
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ===========================
// Route: User Registration
// ===========================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("Register Request Body:", req.body); // Debug log

        // Check if user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ===========================
// Route: User Login
// ===========================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ===========================
// Route: Admin Login
// ===========================
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check admin credentials from environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Create admin token with object payload
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

            return res.json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

    } catch (error) {
        console.error("Admin Login Error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { loginUser, registerUser, adminLogin };

