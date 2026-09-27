const express = require("express");
const studentService = require("../services/libraryStudents.service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const students = await studentService.getStudents();

        res.status(200).json(students);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve library students"
        });
    }
});

router.get("/:studentId", async (req, res) => {
    try {
        const student = await studentService.getStudent(
            req.params.studentId
        );

        if (!student) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Library student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve library student"
        });
    }
});

module.exports = router;