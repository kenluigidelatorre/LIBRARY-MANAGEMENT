require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const createAdmin = async () => {
    try {
        const fullName = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!fullName || !email || !password) {
            throw new Error("Missing admin environment variables.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.query(
            `INSERT INTO public."user"
                (full_name, email, password, role)
             VALUES ($1, LOWER($2), $3, 'ADMIN')
             ON CONFLICT (email)
             DO UPDATE SET
                full_name = EXCLUDED.full_name,
                password = EXCLUDED.password,
                role = 'ADMIN'`,
            [fullName, email.trim(), hashedPassword]
        );

        console.log("Admin account created successfully!");

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createAdmin();