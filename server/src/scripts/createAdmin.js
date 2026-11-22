require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const createAdmin = async () => {
    try {
        const fullName = process.env.ADMIN_NAME?.trim();
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        if (!fullName || !email || !password) {
            throw new Error("Missing admin environment variables.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO public.users
                (full_name, email, password, role)
             VALUES ($1, $2, $3, 'ADMIN')
             ON CONFLICT (email) DO NOTHING`,
            [fullName, email, hashedPassword]
        );

        if (result.rowCount === 0) {
            console.log("An account with this email already exists.");
        } else {
            console.log("Admin account created successfully!");
        }

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createAdmin();