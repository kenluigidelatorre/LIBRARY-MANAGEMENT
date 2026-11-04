
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const swaggerUi = require("swagger-ui-express");
const pool = require("./config/database");

// Middleware
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Routes
const bookRoutes = require("./routes/books.routes");
const libraryFacultyRoutes = require("./routes/libraryFaculty.routes");
const loanRoutes = require("./routes/loans.routes");
const reservationRoutes = require("./routes/reservations.routes");
const fineRoutes = require("./routes/fines.routes");
const registrarRoutes = require("./routes/registrar.routes");
const financePaymentsRoutes = require("./routes/financePayments.routes");
const libraryStudentsRoutes = require("./routes/libraryStudents.routes");

const app = express();

const allowedOrigins = (
    process.env.CORS_ORIGINS || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// CORS
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS_ORIGIN_NOT_ALLOWED"));
    }
}));

// Global middleware
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

// Root
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Library Management System API is running."
    });
});

// Health check
app.get("/api/health", async (req, res, next) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "success",
            service: "library-management-api",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

// Swagger documentation
const openapiPath = path.join(__dirname, "../openapi.yaml");
const openapiDocument = yaml.parse(
    fs.readFileSync(openapiPath, "utf8")
);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument)
);

// API routes
app.use("/api/books", bookRoutes);
app.use("/api/library/faculty", libraryFacultyRoutes);
app.use("/api/registrar", registrarRoutes);
app.use("/api/finance/payments", financePaymentsRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/fines", fineRoutes);
app.use("/api/library/students", libraryStudentsRoutes);

// 404 handler - must be after all routes
app.use(notFound);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/library/students", libraryStudentRoutes);
app.use("/api/v1/library/faculty", libraryFacultyRoutes);
app.use("/api/v1/registrar", registrarRoutes);
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/fines", fineRoutes);
app.use("/api/v1/finance/payments", financePaymentRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;


// Global error handler - must be last
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

if (require.main === module) {
    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);

        try {
            await pool.query("SELECT 1");
            console.log("Connected to PostgreSQL");
        } catch (error) {
            console.error(
                "PostgreSQL is not available:",
                error.message
            );
        }
    });
}

module.exports = app;
