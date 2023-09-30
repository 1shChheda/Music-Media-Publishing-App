const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const moodCtrl = require("../Controllers/moodController");

router.get(
    "/viewMood",
    moodCtrl.ViewMood
);

router.post(
    "/addMood",
    [body("moods").not().isEmpty().withMessage("Moods is required")],
    moodCtrl.AddMood
);

router.put(
    "/updateMood",
    [
        body("id").not().isEmpty().withMessage("id is required"),
        body("moods").not().isEmpty().withMessage("Moods is required"),
    ],
    moodCtrl.UpdateMood
);

router.delete(
    "/deleteMood/:id",
    moodCtrl.DeleteMood
);

module.exports = router;