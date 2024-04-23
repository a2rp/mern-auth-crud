const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"], },
    email: { type: String, required: [true, "email is required"], unique: false },
    phone: { type: String, required: [true, "phone is required"], unique: false },
    about: { type: String, required: [true, "about is required"], },
    user: { type: String, required: [true, "user is required"] }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);

