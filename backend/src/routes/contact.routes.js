const {
    createContact,
    getContacts,
    deleteContact,
    updateContact
} = require("../controllers/contact.controller");

const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");

router.use(requireAuth);

router.post("/", createContact);
router.get("/", getContacts);
router.delete("/", deleteContact);
router.patch("/", updateContact);



module.exports = router;

