const mongoose = require("mongoose");

const connectDB = async (req, res) => {
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB is connected successfully");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectDB };


