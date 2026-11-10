const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: [true, "name is required"], minlength: 3, maxlength: 20, match: /^[a-zA-Z ]+$/ },
    email: { type: String, trim: true, lowercase: true, required: [true, "email is required"], maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { type: String, trim: true, required: [true, "phone is required"], match: /^\d{10}$/ },
    about: { type: String, trim: true, required: [true, "about is required"], minlength: 20, maxlength: 200 },
    user: { type: String, required: [true, "user is required"], index: true }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);

