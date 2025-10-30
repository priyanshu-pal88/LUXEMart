const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

async function registerUser(req, res) {
    try {
        const { fullname: { firstname, lastname }, email, password } = req.body;
        const isUserExist = await userModel.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword
        })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(201).json({ message: "User registered successfully", user: { id: user._id, fullname: user.fullname, email: user.email } });

    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ message: "Login successful", user: { id: user._id, fullname: user.fullname, email: user.email } })

    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

async function verifyUser(req, res) {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({ message: "Unauthorized request" })
        }
        return res.status(200).json({
            message: "User is verified",
            user
        })
    }
    catch (err) {
        res.status(500).json("Unauthorized User ")
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout successful" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function editUser(req, res) {
    try {
        const user = req.user
        const { fullname: { firstname, lastname }, email, } = req.body
        const newUser = await userModel.findByIdAndUpdate(user._id, {
            fullname: { firstname, lastname },
            email
        }, { new: true }).select("-password")
        return res.status(200).json({ message: "User updated successfully", user: newUser })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    registerUser, loginUser, verifyUser, logoutUser, editUser
}

