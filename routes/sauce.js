const express = require("express");
const router = express.Router();
const sauceCtrl = require('./../controllers/sauce')
const auth = require('./../middleware/auth')



router.post("/", auth, sauceCtrl.createSauce);
router.post("/:id/like", auth sauceCtrl.??);
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);




module.exports = router;
