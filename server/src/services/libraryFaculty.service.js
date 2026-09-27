const facultyRepository = require("../data/libraryFaculty.repository");

const getFaculty = async () => {
    return await facultyRepository.getAllFaculty();
};

const getFacultyMember = async (facultyId) => {
    return await facultyRepository.getFacultyById(facultyId);
};

module.exports = {
    getFaculty,
    getFacultyMember
};