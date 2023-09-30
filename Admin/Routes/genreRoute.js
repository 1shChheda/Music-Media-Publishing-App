const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const genreCtrl = require("../Controllers/genreController");

router.get(
    "/viewGenre",
    genreCtrl.ViewGenre
);

router.post(
    "/addGenre",
    [
        body("genre").not().isEmpty().withMessage("Genre is required"),
        // body("active").not().isEmpty().withMessage("Active is required"),
    ],
    genreCtrl.AddGenre
);

router.put(
    "/updateGenre",
    [
        body("id").not().isEmpty().withMessage("id is required"),
        body("genre").not().isEmpty().withMessage("Genre is required"),
    ],
    genreCtrl.UpdateGenre
);

router.delete(
    "/deleteGenre/:id",
    genreCtrl.DeleteGenre
);

module.exports = router;