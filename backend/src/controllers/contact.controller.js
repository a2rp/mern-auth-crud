const Contact = require("../models/contact.model");
// const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.createContact = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }

        const { name, email, phone, about } = req.body;
        if (!name || !email || !phone || !about) {
            throw new Error("All fields must be provided");
        }

        const user = await jwt.verify(token, process.env.TOKEN_KEY);
        const userId = user.id;

        const contactEmail = await Contact.find({ user: userId, email: email.substring(0, 40) });
        console.log(contactEmail, "contact email");
        if (contactEmail.length > 0) {
            throw new Error("Email already added");
        }

        const contactPhone = await Contact.find({ user: userId, phone: phone.substring(0, 10) });
        console.log(contactPhone, "phone");
        if (contactPhone.length > 0) {
            throw new Error("Phone already added");
        }

        const inputData = {
            name: name.substring(0, 20),
            email: email.substring(0, 40),
            phone: phone.substring(0, 10),
            about: about.substring(0, 200),
            user: userId
        };
        const contact = await Contact.create(inputData);
        res.json({ success: true, message: "Contcat added successfully", contact });
    } catch (error) {
        console.log(error, "create contact error");
        res.json({ success: false, error: error.message });
    }
};


module.exports.getContacts = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }
        const user = await jwt.verify(token, process.env.TOKEN_KEY);
        const userId = user.id;

        const contacts = await Contact.find({ user: userId });
        console.log(contacts, "contacts");
        res.json({ success: true, message: "Fetched contacts successfully", contacts });
    } catch (error) {
        console.log(error, "get contacts error");
        res.json({ success: false, error: error.message });
    }
};

module.exports.deleteContact = async (req, res) => {
    try {
        console.log(req.body, "req.npdy");
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }
        const user = await jwt.verify(token, process.env.TOKEN_KEY);
        const userId = user.id;

        const contacts = await Contact.find({ user: userId });
        // console.log(contacts, "contacts");
        console.log(userId, req.body.id);
        const reponse = await Contact.deleteOne({ user: userId, _id: req.body.id });
        res.json({ success: true, message: "Fetched contacts successfully", contacts });
    } catch (error) {
        console.log(error, "get contacts error");
        res.json({ success: false, error: error.message });
    }
};

module.exports.updateContact = async (req, res) => {
    try {
        console.log(req.body, "update req body");
        console.log(req.body, "patch.npdy");
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not found");
        }
        const user = await jwt.verify(token, process.env.TOKEN_KEY);
        const userId = user.id;

        const filter = { _id: req.body.id };
        const update = { name: req.body.name, email: req.body.email, phone: req.body.phone, about: req.body.about };

        const doc = await Contact.findOneAndUpdate(filter, update);
        res.json({ success: true, message: "Updated contact successfully", contact: doc });
    } catch (error) {
        console.log(error, "patcherror");
        res.json({ success: false, error: error.message });
    }
};

