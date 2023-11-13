const express = require("express");
const images = require("../controllers/image.controller");

const router = express.Router();

router.route("/")
    .get(images.findAll)
    .post(images.create)
    .delete(images.deleteAll)

router.route("/:id")
    .get(images.findOne)
    .delete(images.delete)

module.exports = router;