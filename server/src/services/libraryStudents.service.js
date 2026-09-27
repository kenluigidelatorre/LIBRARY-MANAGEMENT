const studentRepository = require("../data/libraryStudents.repository");

const getStudents = async () => {
    return await studentRepository.getAllStudents();
};

const getStudent = async (studentId) => {
    return await studentRepository.getStudentById(studentId);
};

module.exports = {
    getStudents,
    getStudent
};