const registrarRepository = require("../data/registrar.repository");

const getStudents = async (filters) => {
    return registrarRepository.getStudents(filters);
};

const getStudent = async (studentId) => {
    return registrarRepository.getStudentById(studentId);
};

module.exports = {
    getStudents,
    getStudent
};