const app = require("./app");
const config = require("./app/config");

// Khoi chay server
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});