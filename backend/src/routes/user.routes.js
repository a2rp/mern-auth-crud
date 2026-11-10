const { register, login, logout } = require("../controllers/user.controllers");
const { userVerification } = require("../middlewares/user.verification");
const requireAuth = require("../middlewares/requireAuth");
const router = require("express").Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/", requireAuth, userVerification);



module.exports = router;

