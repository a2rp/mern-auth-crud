require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const { connectDB } = require("./src/middlewares/connect.db");
const userRoutes = require("./src/routes/user.routes");
const contactRoutes = require("./src/routes/contact.routes");

connectDB();
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/a2rp", (req, res) => {
    try {
        res.status(200).json({ success: true, message: "a2rp: an Ashish Ranjan presentation" });;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);

app.listen(PORT, console.log(`server listening on port http://localhost:${PORT}`));
