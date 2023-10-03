const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const adminCtrl = require("../Controllers/adminController");

router.post("/addAdmin", adminCtrl.createAdmin);

module.exports = router;