
const registrarRepository = require("../data/registrar.repository");
const { request } = require("./httpClient");

const mode = () =>
    (process.env.REGISTRAR_MODE || "mock").toLowerCase();

const MOCK_STUDENTS = [
    {
        studentId: "202610897",
        name: "Juan Dela Cruz",
        departmentOrProgram: "BS Information Technology",
        status: "ENROLLED",
        email: "juan.delacruz@school.edu",
        yearLevel: "3rd Year"
    },
    {
        studentId: "202610898",
        name: "Maria Santos",
        departmentOrProgram: "BS Business Administration",
        status: "ENROLLED",
        email: "maria.santos@school.edu",
        yearLevel: "2nd Year"
    },
    {
        studentId: "202610899",
        name: "Pedro Reyes",
        departmentOrProgram: "BS Information Technology",
        status: "INACTIVE",
        email: "pedro.reyes@school.edu",
        yearLevel: "4th Year"
    }
];

function getStudentsUrl() {
    const base = process.env.REGISTRAR_API_BASE_URL;
    const path = process.env.REGISTRAR_STUDENTS_PATH;

    if (!base) throw new Error("REGISTRAR_API_BASE_URL_REQUIRED");
    if (!path) throw new Error("REGISTRAR_STUDENTS_PATH_REQUIRED");

    return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function normalizeStudent(record) {
    const student = record?.data || record?.student || record;

    if (!student || typeof student !== "object") return null;

    const studentId =
        student.studentId ??
        student.student_id ??
        student.id;

    const status =
        student.status ??
        student.enrollmentStatus ??
        student.enrollment_status;

    if (!studentId || !status) return null;

    return {
        studentId: String(studentId),
        name: student.name ?? student.fullName ?? student.full_name ?? "",
        departmentOrProgram:
            student.departmentOrProgram ??
            student.program ??
            student.department ??
            "",
        status: String(status).toUpperCase(),
        email: student.email ?? null,
        yearLevel: student.yearLevel ?? student.year_level ?? null
    };
}

async function getStudents(filters = {}) {
    if (mode() === "mock") {
        return registrarRepository.getStudents(filters, MOCK_STUDENTS);
    }

    if (mode() !== "live") {
        throw new Error("INVALID_REGISTRAR_MODE");
    }

    const url = new URL(getStudentsUrl());

    Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
    });

    const response = await request(url.toString());

    const records = Array.isArray(response)
        ? response
        : response?.data ?? response?.students;

    if (!Array.isArray(records)) {
        throw new Error("REGISTRAR_RESPONSE_INVALID");
    }

    return records.map(normalizeStudent).filter(Boolean);
}

async function getStudent(studentId) {
    if (!studentId) return null;

    if (mode() === "mock") {
        return registrarRepository.getStudentById(
            studentId,
            MOCK_STUDENTS
        );
    }

    if (mode() !== "live") {
        throw new Error("INVALID_REGISTRAR_MODE");
    }

    const url =
        `${getStudentsUrl()}/${encodeURIComponent(studentId)}`;

    const response = await request(url);

    return normalizeStudent(response);
}

async function verifyStudentEligibility(studentId) {
    if (!studentId) {
        throw new Error("STUDENT_ID_REQUIRED");
    }

    const student = await getStudent(studentId);

    if (!student) {
        throw new Error("REGISTRAR_STUDENT_NOT_FOUND");
    }

    if (student.status !== "ENROLLED") {
        throw new Error("STUDENT_NOT_ELIGIBLE");
    }

    return {
        eligible: true,
        mode: mode(),
        student
    };
}

module.exports = {
    getStudents,
    getStudent,
    verifyStudentEligibility,
    getMode: mode
};
