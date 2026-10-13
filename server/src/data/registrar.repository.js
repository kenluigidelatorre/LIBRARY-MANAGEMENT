const students = [
  {
    studentId: "202610897",
    name: "Juan Dela Cruz",
    departmentOrProgram: "BS Information Technology",
    status: "ENROLLED",
    email: "juan.delacruz@school.edu",
    yearLevel: "3rd Year",
    updatedAt: "2026-09-27T08:00:00Z",
  },
  {
    studentId: "202610898",
    name: "Maria Santos",
    departmentOrProgram: "BS Business Administration",
    status: "ENROLLED",
    email: "maria.santos@school.edu",
    yearLevel: "2nd Year",
    updatedAt: "2026-09-27T08:00:00Z",
  },
  {
    studentId: "202610899",
    name: "Pedro Reyes",
    departmentOrProgram: "BS Information Technology",
    status: "INACTIVE",
    email: "pedro.reyes@school.edu",
    yearLevel: "4th Year",
    updatedAt: "2026-09-27T08:00:00Z",
  },
];

const faculty = [
  {
    facultyId: "FAC-1001",
    name: "Maria Santos",
    email: "maria.santos@school.edu",
    department: "College of Information Technology",
    status: "ACTIVE",
    updatedAt: "2026-09-27T08:00:00Z",
  },
  {
    facultyId: "FAC-1002",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@school.edu",
    department: "College of Business",
    status: "ACTIVE",
    updatedAt: "2026-09-27T08:00:00Z",
  },
  {
    facultyId: "FAC-1003",
    name: "Ana Reyes",
    email: "ana.reyes@school.edu",
    department: "College of Information Technology",
    status: "INACTIVE",
    updatedAt: "2026-09-27T08:00:00Z",
  },
];

const getStudents = (filters = {}) => {
  let result = [...students];

  if (filters.department) {
    result = result.filter((student) =>
      student.departmentOrProgram
        .toLowerCase()
        .includes(filters.department.toLowerCase()),
    );
  }

  if (filters.program) {
    result = result.filter((student) =>
      student.departmentOrProgram
        .toLowerCase()
        .includes(filters.program.toLowerCase()),
    );
  }

  if (filters.status) {
    result = result.filter(
      (student) =>
        student.status.toUpperCase() === filters.status.toUpperCase(),
    );
  }

  return result;
};

const getStudentById = (studentId) => {
  return students.find((student) => student.studentId === studentId);
};

const getFaculty = (filters = {}) => {
  let result = [...faculty];

  if (filters.department) {
    result = result.filter((member) =>
      member.department
        .toLowerCase()
        .includes(filters.department.toLowerCase()),
    );
  }

  if (filters.status) {
    result = result.filter(
      (member) => member.status.toUpperCase() === filters.status.toUpperCase(),
    );
  }

  return result;
};

const getFacultyById = (facultyId) => {
  return faculty.find((member) => member.facultyId === facultyId);
};

module.exports = {
  getStudents,
  getStudentById,
  getFaculty,
  getFacultyById,
};
