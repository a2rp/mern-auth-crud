const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required." });

    try {
        const payload = jwt.verify(token, process.env.TOKEN_KEY, { algorithms: ["HS256"] });
        if (typeof payload.id !== "string" || !mongoose.isValidObjectId(payload.id)) {
            return res.status(401).json({ success: false, message: "Authentication required." });
        }
        req.userId = payload.id;
        return next();
    } catch {
        return res.status(401).json({ success: false, message: "Authentication required." });
    }
};
