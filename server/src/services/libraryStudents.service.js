const registrarService = require("./registrar.service");

// Get all students through the shared Registrar service
const getStudents = async () => {
    return await registrarService.getStudents();
};

// Get one student through the shared Registrar service
const getStudentById = async (studentId) => {
    return await registrarService.getStudent(studentId);
};

module.exports = {
    getStudents,
    getStudentById
};