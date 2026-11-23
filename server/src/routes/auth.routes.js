
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

// ADMIN AND LIBRARY STAFF LOGIN
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Authentication configuration error."
            });
        }

        const result = await pool.query(
            `SELECT id, full_name, email, password, role
             FROM public.users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

// GET CURRENT LOGGED-IN USER
router.get("/me", authenticateToken, async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT id, full_name, email, role
             FROM public.users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        const user = result.rows[0];

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

// GET ALL LIBRARY STAFF - ADMIN ONLY
router.get(
    "/staff",
    authenticateToken,
    authorizeRoles("ADMIN"),
    async (req, res, next) => {
        try {
            const result = await pool.query(
                `SELECT id, full_name, email, role
                 FROM public.users
                 WHERE role = 'LIBRARY_STAFF'
                 ORDER BY full_name ASC`
            );

            return res.status(200).json({
                success: true,
                count: result.rows.length,
                data: result.rows.map(user => ({
                    id: user.id,
                    fullName: user.full_name,
                    email: user.email,
                    role: user.role
                }))
            });

        } catch (error) {
            next(error);
        }
    }
);

// CREATE LIBRARY STAFF - ADMIN ONLY
router.post(
    "/staff",
    authenticateToken,
    authorizeRoles("ADMIN"),
    async (req, res, next) => {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName?.trim() || !email?.trim() || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Full name, email, and password are required."
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters."
                });
            }

            const normalizedEmail = email.trim().toLowerCase();

            const existingUser = await pool.query(
                `SELECT id
                 FROM public.users
                 WHERE LOWER(email) = $1`,
                [normalizedEmail]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const result = await pool.query(
                `INSERT INTO public.users
                    (full_name, email, password, role)
                 VALUES ($1, $2, $3, 'LIBRARY_STAFF')
                 RETURNING id, full_name, email, role`,
                [
                    fullName.trim(),
                    normalizedEmail,
                    hashedPassword
                ]
            );

            const staff = result.rows[0];

            return res.status(201).json({
                success: true,
                message: "Library staff account created successfully.",
                data: {
                    id: staff.id,
                    fullName: staff.full_name,
                    email: staff.email,
                    role: staff.role
                }
            });

        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists."
                });
            }

            next(error);
        }
    }
);

module.exports = router;
