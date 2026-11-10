const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "email address is required"],
        unique: true,
        maxlength: 254,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    username: {
        type: String,
        trim: true,
        required: [true, "username is required"],
        minlength: 3,
        maxlength: 32,
        match: [/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores."],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false,
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);

