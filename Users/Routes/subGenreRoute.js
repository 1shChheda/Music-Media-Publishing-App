const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const subGenreCtrl = require("../Controllers/subGenreController");

router.get(
    "/viewSubGenre",
    subGenreCtrl.viewSubGenre
);

router.post(
    "/addSubGenre",
    [
        body("subGenre").not().isEmpty().withMessage("SubGenre is required"),
        // body("active").not().isEmpty().withMessage("Active is required"),
    ],
    subGenreCtrl.AddSubGenre
);

router.put(
    "/updateSubGenre",
    [
        body("id").not().isEmpty().withMessage("id is required"),
        body("subGenre").not().isEmpty().withMessage("SubGenre is required"),
    ],
    subGenreCtrl.UpdateSubGenre
);

router.delete(
    "/deleteSubGenre/:id",
    subGenreCtrl.DeleteSubGenre
);

module.exports = router;