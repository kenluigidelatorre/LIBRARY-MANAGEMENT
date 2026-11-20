require("dotenv").config();

const pool = require("./src/config/database");

async function checkDatabase() {
    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                to_regclass('public.users') AS users_table
        `);

        console.log("Database connection information:");
        console.table(result.rows);

    } catch (error) {
        console.error("Database check failed:", error.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();