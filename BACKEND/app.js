const express = require("express");
const cors = require("cors");
const goodsRouter = require("./app/routes/good.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/goods", goodsRouter);

// Xu ly loi 404
app.use((req, res, next) => {
    // Thuc hien khi khong co route duoc dinh nghia phu hop voi yeu cau
    // next() goi middleware xu ly
    return next(new ApiError(404, "Resource not found"));
})

// Xu ly loi tap trung
app.use((err, req, res, next) => {
    // Khi cac route goi next(error) thi se goi xu ly o day
    return res.status(console.error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the project."
    });
});

module.exports = app;