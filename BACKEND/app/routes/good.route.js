const express = require("express");
const goods = require("../controllers/good.controller");

const router = express.Router();

router.route("/")
      .get(goods.findAll)
      .post(goods.create)
      .delete(goods.deleteAll);

router.route("/:id")
      .get(goods.findOne)
      .put(goods.update)
      .delete(goods.delete);

module.exports = router;