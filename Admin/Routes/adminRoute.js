const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const tokenVerify = require("../Middleware/tokenVerify");

const isAdmin = require("../Middleware/isAdmin");

const adminCtrl = require("../Controllers/adminController");

router.post("/addAdmin", tokenVerify, isAdmin, adminCtrl.createAdmin);

router.get("/getAllAdmins", tokenVerify, isAdmin, adminCtrl.getAllAdmins);

router.put("/updateAdmin", tokenVerify, isAdmin, adminCtrl.updateAdmin);

router.delete("/deleteAdmin/:id", tokenVerify, isAdmin, adminCtrl.deleteAdmin);

router.post('/banAcc', tokenVerify, isAdmin, adminCtrl.banController);

router.post('/UnBanAcc', tokenVerify, isAdmin, adminCtrl.removeBanController);

module.exports = router;