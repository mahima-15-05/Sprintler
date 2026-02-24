const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require('../services/utils/generateToken')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizeEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const existingUser = await User.findOne({ email: normalizeEmail });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already registered, please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: trimmedName,
      email: normalizeEmail,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const INVALID_CRED = "Invalid Credentials";
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const normalizeEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizeEmail });
    if (!existingUser) {
      return res.status(401).json({ message: INVALID_CRED });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatched) {
      return res.status(401).json({ message: INVALID_CRED });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
         _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        token:generateToken(existingUser._id)
      },
    });
  } catch (error) {
    return res.status(500).json({message:error.message || "Internal server error"})
  }
};

const logout = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
};
