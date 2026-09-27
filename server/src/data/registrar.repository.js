const students = [
    {
        studentId: "202610897",
        name: "Juan Dela Cruz",
        departmentOrProgram: "BS Information Technology",
        status: "ENROLLED",
        email: "juan.delacruz@school.edu",
        yearLevel: "3rd Year",
        updatedAt: "2026-09-27T08:00:00Z"
    },
    {
        studentId: "202610898",
        name: "Maria Santos",
        departmentOrProgram: "BS Business Administration",
        status: "ENROLLED",
        email: "maria.santos@school.edu",
        yearLevel: "2nd Year",
        updatedAt: "2026-09-27T08:00:00Z"
    },
    {
        studentId: "202610899",
        name: "Pedro Reyes",
        departmentOrProgram: "BS Information Technology",
        status: "INACTIVE",
        email: "pedro.reyes@school.edu",
        yearLevel: "4th Year",
        updatedAt: "2026-09-27T08:00:00Z"
    }
];

const getStudents = (filters = {}) => {
    let result = [...students];

    if (filters.department) {
        result = result.filter(student =>
            student.departmentOrProgram
                .toLowerCase()
                .includes(filters.department.toLowerCase())
        );
    }

    if (filters.program) {
        result = result.filter(student =>
            student.departmentOrProgram
                .toLowerCase()
                .includes(filters.program.toLowerCase())
        );
    }

    if (filters.status) {
        result = result.filter(
            student => student.status === filters.status
        );
    }

    return result;
};

const getStudentById = (studentId) => {
    return students.find(
        student => student.studentId === studentId
    );
};

module.exports = {
    getStudents,
    getStudentById
};