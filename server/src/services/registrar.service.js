const registrarRepository = require("../data/registrar.repository");

const getStudents = async (filters = {}) => {
  return registrarRepository.getStudents(filters);
};

const getStudent = async (studentId) => {
  return registrarRepository.getStudentById(studentId);
};

const getFaculty = async (filters = {}) => {
  return registrarRepository.getFaculty(filters);
};

const getFacultyMember = async (facultyId) => {
  return registrarRepository.getFacultyById(facultyId);
};

module.exports = {
  getStudents,
  getStudent,
  getFaculty,
  getFacultyMember,
};
