const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user_controller");
const { email, password } = require("../middleware/log-validator.js");
const { limiter } = require("../middleware/rate-limit.js");
router.post("/signup", email, password, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
