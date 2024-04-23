const {
    createContact,
    getContacts,
    deleteContact,
    updateContact
} = require("../controllers/contact.controller");

const router = require("express").Router();

router.post("/", createContact);
router.get("/", getContacts);
router.delete("/", deleteContact);
router.patch("/", updateContact);



module.exports = router;

