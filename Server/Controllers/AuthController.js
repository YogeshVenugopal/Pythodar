import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const Register = async (req, res) => {
    const { username, email, registerno, mobile, department, password, role } = req.body;
    try {
        if (!username || !email || !registerno || !mobile || !department || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { registerno }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Register Number already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            registerno,
            mobile,
            department,
            password: hashedPassword,
            role,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const Login = async (req, res) => {
    const { registerno, password } = req.body;
    try {
        if (!registerno || !password) {
            return res.status(400).json({ message: "Register Number and Password are required" });
        }
        const user = await User.findOne({ registerno });
        if (!user) {
            return res.status(400).json({ message: "Invalid Register Number or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Register Number or Password" });
        }
        const token = generateToken(user._id);

        res.status(200).json({token});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const UserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error", error:error});
    }
}

export const UpdateProfile = async (req, res) => {
    const { username, email, mobile, department } = req.body;
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        user.username = username || user.username;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.department = department || user.department;
        await user.save();
        return res.json({message:"Profile updated successfully"});       
    } catch (error) {
        console.log("Update User error",error);
        res.status(500).json({message:"Internal server error", error});
    }
}