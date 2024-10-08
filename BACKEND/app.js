const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
const customesRouter = require("./app/routes/customer.route");
const staffsRouter = require("./app/routes/staff.route");
const imagesRouter = require("./app/routes/image.route");

app.use(cors());
app.use(express.json());
app.use("/api/customers", customesRouter);
app.use("/api/staffs", staffsRouter);
app.use("/api/images", imagesRouter);

// Xu ly loi 404
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
})

// Xu ly loi tap chung bang middleware
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the application."
    });
});

module.exports = app;