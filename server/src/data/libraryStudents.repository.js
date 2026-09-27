const pool = require("../config/database");

const getAllStudents = async () => {
    const result = await pool.query(`
        SELECT
            student_id AS "studentId",
            name,
            program,
            year_level AS "yearLevel",
            library_status AS "libraryStatus"
        FROM library_students
        ORDER BY student_id
    `);

    return result.rows;
};

const getStudentById = async (studentId) => {
    const result = await pool.query(`
        SELECT
            student_id AS "studentId",
            name,
            program,
            year_level AS "yearLevel",
            library_status AS "libraryStatus"
        FROM library_students
        WHERE student_id = $1
    `, [studentId]);

    return result.rows[0];
};

module.exports = {
    getAllStudents,
    getStudentById
};