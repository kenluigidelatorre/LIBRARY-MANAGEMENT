const express = require("express");
const studentService = require("../services/libraryStudents.service");

const router = express.Router();

// GET all students from Registrar
router.get("/", async (req, res, next) => {
  try {
    const students = await studentService.getStudents();

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

// GET student by ID from Registrar
router.get("/:studentId", async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(
      req.params.studentId
    );

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;