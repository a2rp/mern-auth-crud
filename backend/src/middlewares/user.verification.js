const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }

        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                return res.json({ success: false, message: "Error verifying token" });
            } else {
                const user = await User.findById(data.id);
                if (!user) return res.json({ success: false, message: "User not found" });
                return res.json({
                    success: true,
                    message: "User found", username: user.username
                });
            }
        });
    } catch (error) {
        console.log(error, "user verficatin error");
        res.json({ succes: false, message: error.message });
    }
}

