const express = require("express");
const registrarService = require("../services/registrar.service");

const router = express.Router();

// GET /api/v1/registrar/students
router.get("/students", async (req, res) => {
  try {
    const students = await registrarService.getStudents({
      department: req.query.department,
      program: req.query.program,
      status: req.query.status,
    });

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error retrieving Registrar students:", error);

    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Failed to retrieve Registrar students",
    });
  }
});

// GET /api/v1/registrar/students/:studentId
router.get("/students/:studentId", async (req, res) => {
  try {
    const student = await registrarService.getStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        statusCode: 404,
        error: "Not Found",
        message: "Registrar student not found",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error retrieving Registrar student:", error);

    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Failed to retrieve Registrar student",
    });
  }
});

// GET /api/v1/registrar/faculty
router.get("/faculty", async (req, res) => {
  try {
    const faculty = await registrarService.getFaculty({
      department: req.query.department,
      status: req.query.status,
    });

    return res.status(200).json(faculty);
  } catch (error) {
    console.error("Error retrieving Registrar faculty:", error);

    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Failed to retrieve Registrar faculty",
    });
  }
});

// GET /api/v1/registrar/faculty/:facultyId
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const facultyMember = await registrarService.getFacultyMember(
      req.params.facultyId,
    );

    if (!facultyMember) {
      return res.status(404).json({
        statusCode: 404,
        error: "Not Found",
        message: "Registrar faculty member not found",
      });
    }

    return res.status(200).json(facultyMember);
  } catch (error) {
    console.error("Error retrieving Registrar faculty member:", error);

    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Failed to retrieve Registrar faculty member",
    });
  }
});

module.exports = router;
