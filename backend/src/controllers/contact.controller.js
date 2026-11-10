const mongoose = require("mongoose");
const Contact = require("../models/contact.model");

const normalizeContact = (body) => {
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const about = typeof body?.about === "string" ? body.about.trim() : "";
    if (!/^[a-zA-Z ]{3,20}$/.test(name)
        || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || !/^\d{10}$/.test(phone)
        || about.length < 20 || about.length > 200) return null;
    return { name, email, phone, about };
};

const findDuplicate = async (details, userId, exceptId) => {
    const filter = { user: userId, ...(exceptId ? { _id: { $ne: exceptId } } : {}) };
    const [emailExists, phoneExists] = await Promise.all([
        Contact.exists({ ...filter, email: details.email }),
        Contact.exists({ ...filter, phone: details.phone }),
    ]);
    if (emailExists) return "A contact with this email already exists.";
    if (phoneExists) return "A contact with this phone number already exists.";
    return null;
};

const sendFailure = (res, error) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ success: false, message: "Check the contact details and try again." });
    }
    console.error("Contact request failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to process the contact right now." });
};

module.exports.createContact = async (req, res) => {
    const details = normalizeContact(req.body);
    if (!details) return res.status(400).json({ success: false, message: "Enter a valid name, email, 10-digit phone, and 20–200 character note." });
    try {
        const duplicate = await findDuplicate(details, req.userId);
        if (duplicate) return res.status(409).json({ success: false, message: duplicate });
        const contact = await Contact.create({ ...details, user: req.userId });
        return res.status(201).json({ success: true, message: "Contact added successfully.", contact });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
        return res.json({ success: true, contacts });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.deleteContact = async (req, res) => {
    const id = req.body?.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid contact ID." });
    try {
        const contact = await Contact.findOneAndDelete({ _id: id, user: req.userId });
        if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });
        return res.json({ success: true, message: "Contact deleted.", contactId: id });
    } catch (error) {
        return sendFailure(res, error);
    }
};

module.exports.updateContact = async (req, res) => {
    const id = req.body?.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid contact ID." });
    const details = normalizeContact(req.body);
    if (!details) return res.status(400).json({ success: false, message: "Enter a valid name, email, 10-digit phone, and 20–200 character note." });
    try {
        const duplicate = await findDuplicate(details, req.userId, id);
        if (duplicate) return res.status(409).json({ success: false, message: duplicate });
        const contact = await Contact.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: details },
            { new: true, runValidators: true },
        );
        if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });
        return res.json({ success: true, message: "Contact updated successfully.", contact });
    } catch (error) {
        return sendFailure(res, error);
    }
};
