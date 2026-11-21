const getStudents = (filters = {}, students = []) => {
    let result = [...students];

    if (filters.department) {
        result = result.filter(student =>
            String(student.departmentOrProgram || "").toLowerCase().includes(String(filters.department).toLowerCase())
        );
    }
    if (filters.program) {
        result = result.filter(student =>
            String(student.departmentOrProgram || "").toLowerCase().includes(String(filters.program).toLowerCase())
        );
    }
    if (filters.status) {
        result = result.filter(student => student.status === String(filters.status).toUpperCase());
    }
    return result;
};

const getStudentById = (studentId, students = []) =>
    students.find(student => student.studentId === String(studentId)) || null;

module.exports = { getStudents, getStudentById };
