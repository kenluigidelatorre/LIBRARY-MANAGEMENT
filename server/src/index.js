const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const bookRoutes = require("./routes/books.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Library Management System API is running"
    });
});

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        console.log("Connected to PostgreSQL");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();