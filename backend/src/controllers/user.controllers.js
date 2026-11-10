const User = require("../models/user.model");
const { createSecretToken } = require("../utils/secret.token");
const { authCookieOptions, clearAuthCookieOptions } = require("../utils/auth-cookie");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidUsername, isValidPassword } = require("../utils/validator");

const publicUser = (user) => ({ id: user._id.toString(), email: user.email, username: user.username });

module.exports.register = async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body || {};
        if (![email, username, password, confirmPassword].every((value) => typeof value === "string" && value.trim())) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();
        if (!isValidEmail(normalizedEmail)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
        if (!isValidUsername(normalizedUsername)) return res.status(400).json({ success: false, message: "Username must be 3–32 characters using letters, numbers, or underscores." });
        if (!isValidPassword(password)) return res.status(400).json({ success: false, message: "Use 12–72 characters with an uppercase letter, lowercase letter, number, and symbol." });
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        if (await User.exists({ email: normalizedEmail })) {
            return res.status(409).json({ success: false, message: "Could not create an account with those details." });
        }

        const user = await User.create({ email: normalizedEmail, username: normalizedUsername, password });
        const token = createSecretToken(user._id);
        res.cookie("token", token, authCookieOptions);
        return res.status(201).json({ success: true, message: "Account created successfully.", user: publicUser(user) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: "Could not create an account with those details." });
        if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Check the account details and try again." });
        console.error("Registration failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to register right now." });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
        if (!user || !passwordMatches) return res.status(401).json({ success: false, message: "Email or password is incorrect." });

        const token = createSecretToken(user._id);
        res.cookie("token", token, authCookieOptions);
        return res.json({ success: true, message: "Logged in successfully.", user: publicUser(user) });
    } catch (error) {
        console.error("Login failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to log in right now." });
    }
};

module.exports.logout = (_req, res) => {
    res.clearCookie("token", clearAuthCookieOptions);
    return res.json({ success: true, message: "Logged out successfully." });
};

