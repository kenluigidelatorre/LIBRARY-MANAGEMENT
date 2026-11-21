const express = require("express");
const facultyService = require("../services/libraryFaculty.service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const faculty = await facultyService.getFaculty();

        res.status(200).json(faculty);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve library faculty"
        });
    }
});

router.get("/:facultyId", async (req, res) => {
    try {
        const faculty = await facultyService.getFacultyMember(
            req.params.facultyId
        );

        if (!faculty) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Library faculty member not found"
            });
        }

        res.status(200).json(faculty);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve library faculty member"
        });
    }
});

module.exports = router;