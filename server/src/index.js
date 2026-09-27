const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");

const pool = require("./config/database");

const bookRoutes = require("./routes/books.routes");
const libraryStudentRoutes = require("./routes/libraryStudents.routes");
const libraryFacultyRoutes = require("./routes/libraryFaculty.routes");
const registrarRoutes = require("./routes/registrar.routes");
const loanRoutes = require("./routes/loans.routes");
const reservationRoutes = require("./routes/reservations.routes");
const fineRoutes = require("./routes/fines.routes");
const financePaymentRoutes = require("./routes/financePayments.routes");

const app = express();

app.use(cors());
app.use(express.json());

const openapiPath = path.join(__dirname, "../openapi.yaml");
const openapiDocument = yaml.parse(
    fs.readFileSync(openapiPath, "utf8")
);

app.get("/", (req, res) => {
    res.json({
        message: "Library Management System API is running"
    });
});

app.use("/api/books", bookRoutes);
app.use("/api/library/students", libraryStudentRoutes);
app.use("/api/library/faculty", libraryFacultyRoutes);
app.use("/api/registrar", registrarRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/fines", fineRoutes);
app.use("/api/finance/payments", financePaymentRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

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