const { register, login } = require("../controllers/user.controllers");
const { userVerification } = require("../middlewares/user.verification");
const router = require("express").Router();


router.post("/register", register);
router.post("/login", login);
router.post("/", userVerification);



module.exports = router;

