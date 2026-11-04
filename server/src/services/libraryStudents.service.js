const REGISTRAR_API_URL =
  process.env.REGISTRAR_API_URL ||
  "http://localhost:5001/api/registrar/students";

// Get all students from Registrar
const getStudents = async () => {
  const response = await fetch(REGISTRAR_API_URL);

  if (!response.ok) {
    throw new Error(`Registrar API error: ${response.status}`);
  }

  const result = await response.json();

  return result.data;
};

// Get one student from Registrar
const getStudentById = async (studentId) => {
  const response = await fetch(
    `${REGISTRAR_API_URL}/${encodeURIComponent(studentId)}`
  );

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? "Student not found in Registrar."
        : `Registrar API error: ${response.status}`
    );

    error.statusCode = response.status;
    throw error;
  }

  const result = await response.json();

  return result.data;
};

module.exports = {
  getStudents,
  getStudentById,
};