const pool = require("../config/database");

const getAllFaculty = async () => {
    const result = await pool.query(`
        SELECT
            faculty_id AS "facultyId",
            name,
            department,
            email,
            library_status AS "libraryStatus"
        FROM library_faculty
        ORDER BY faculty_id
    `);

    return result.rows;
};

const getFacultyById = async (facultyId) => {
    const result = await pool.query(`
        SELECT
            faculty_id AS "facultyId",
            name,
            department,
            email,
            library_status AS "libraryStatus"
        FROM library_faculty
        WHERE faculty_id = $1
    `, [facultyId]);

    return result.rows[0];
};

module.exports = {
    getAllFaculty,
    getFacultyById
};