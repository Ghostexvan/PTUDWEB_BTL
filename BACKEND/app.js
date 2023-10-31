const express = require("express");
const cors = require("cors");

const app = express();

const goodsRouter = require("./app/routes/good.route");

app.use(cors());
app.use(express.json());
app.use("/api/goods", goodsRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the project."
    });
});

module.exports = app;