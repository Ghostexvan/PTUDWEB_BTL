const express = require("express");
const cors = require("cors");

const app = express();
const customesRouter = require("./app/routes/customer.route");

app.use(cors());
app.use(express.json());
app.use("/api/customers", customesRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the application."
    });
});

module.exports = app;