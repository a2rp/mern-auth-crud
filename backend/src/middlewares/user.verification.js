const User = require("../models/user.model");

module.exports.userVerification = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("_id username email");
        if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
        return res.json({ success: true, user: { id: user._id.toString(), username: user.username, email: user.email } });
    } catch (error) {
        console.error("Session verification failed:", error.message);
        return res.status(500).json({ success: false, message: "Unable to verify the session right now." });
    }
};
