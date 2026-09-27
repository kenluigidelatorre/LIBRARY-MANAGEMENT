const express = require("express");
const registrarService = require("../services/registrar.service");

const router = express.Router();

router.get("/students", async (req, res) => {
    try {
        const students = await registrarService.getStudents({
            department: req.query.department,
            program: req.query.program,
            status: req.query.status
        });

        res.status(200).json(students);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve Registrar students"
        });
    }
});

router.get("/students/:studentId", async (req, res) => {
    try {
        const student = await registrarService.getStudent(
            req.params.studentId
        );

        if (!student) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Registrar student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve Registrar student"
        });
    }
});

module.exports = router;