const User = require("../models/user.model");
const { createSecretToken } = require("../utils/secret.token");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidUsername, isValidPassword } = require("../utils/validator");

module.exports.register = async (req, res, next) => {
    try {
        // console.log(req.body, "req.body");
        const { email, username, password, confirmPassword } = req.body;

        if (!email || !username || !password || !confirmPassword) {
            throw new Error("All fields are required");
        }

        if (password.trim() !== confirmPassword.trim()) {
            throw new Error("Passwords do not match");
        }

        const inputData = {
            email: email.substring(0, 50),
            username: username.substring(0, 10),
            password: password.substring(0, 18),
        };
        // console.log(inputData, "inputdata");

        if (!isValidEmail(inputData.email)) {
            throw new Error("Invalid email - " + inputData.email);
        }

        if (!isValidUsername(username)) {
            throw new Error("Invalid username - " + inputData.username);
        }

        if (!isValidPassword(password)) {
            throw new Error("Invalid password - " + inputData.password);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await User.create(inputData);
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ success: true, message: "User signed in successfully", user });
        // next();
    } catch (error) {
        // console.error(error.message, "error register");
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body, "req.body");

        if (!email || !password) {
            throw new Error("All fields are required.");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not registered.");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new Error("Incorrect password");
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ success: true, message: "User logged in successfully" });
        // next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

