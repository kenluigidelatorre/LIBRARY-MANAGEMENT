
const express = require("express");
const registrarService = require("../services/registrar.service");

const router = express.Router();

// GET /api/registrar/students
router.get("/students", async (req, res) => {
    try {
        const students = await registrarService.getStudents({
            studentId: req.query.studentId,
            status: req.query.status,
            department: req.query.department
        });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error("Registrar lookup error:", error.message);

        return res.status(error.status || 502).json({
            success: false,
            message: "Failed to retrieve Registrar students",
            error: error.message
        });
    }
});

// GET /api/registrar/students/:studentId
router.get("/students/:studentId", async (req, res) => {
    try {
        const student = await registrarService.getStudent(
            req.params.studentId
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error("Registrar student error:", error.message);

        return res.status(error.status || 502).json({
            success: false,
            message: "Failed to retrieve Registrar student",
            error: error.message
        });
    }
});

module.exports = router;
