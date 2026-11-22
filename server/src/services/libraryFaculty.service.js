const facultyRepository = require("../data/libraryFaculty.repository");

const getFaculty = async () => {
    return await facultyRepository.getAllFaculty();
};

const getFacultyMember = async (facultyId) => {
    return await facultyRepository.getFacultyById(facultyId);
};

// Verify faculty eligibility before borrowing
const verifyFacultyEligibility = async (facultyId) => {
    if (!facultyId) {
        throw new Error("FACULTY_ID_REQUIRED");
    }

    const faculty = await facultyRepository.getFacultyById(facultyId);

    if (!faculty) {
        throw new Error("FACULTY_NOT_FOUND");
    }

    if (
        String(faculty.libraryStatus || "").toUpperCase() !== "ACTIVE"
    ) {
        throw new Error("FACULTY_NOT_ELIGIBLE");
    }

    return faculty;
};

module.exports = {
    getFaculty,
    getFacultyMember,
    verifyFacultyEligibility
};