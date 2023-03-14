const express = require("express");
const router = express.Router();
const userCtrl = require("./../controllers/user");
const { email, password } = require("../middleware/validator.js");

router.post("/signup", email, userCtrl.signup);
router.post("/login", email, userCtrl.login);

module.exports = router;
