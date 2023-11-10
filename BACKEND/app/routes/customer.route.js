const express = require("express");
const customers = require("../controllers/customer.controller");

const router = express.Router();

router.route("/")
    .get(customers.findAll)
    .post(customers.create)
    .delete(customers.deleteAll)

router.route("/:id")
    .get(customers.findOne)
    .put(customers.update)
    .delete(customers.delete)

module.exports = router;