const pool = require("../config/database");

const getAllFines = async (filters = {}) => {
    let query = `
        SELECT
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            loan_id AS "loanId",
            amount,
            reason,
            status
        FROM fines
    `;

    const values = [];
    const conditions = [];

    if (filters.borrowerType) {
        values.push(filters.borrowerType);
        conditions.push(`borrower_type = $${values.length}`);
    }

    if (filters.borrowerId) {
        values.push(filters.borrowerId);
        conditions.push(`borrower_id = $${values.length}`);
    }

    if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY fine_id";

    const result = await pool.query(query, values);

    return result.rows;
};

const getFineById = async (fineId) => {
    const result = await pool.query(`
        SELECT
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            loan_id AS "loanId",
            amount,
            reason,
            status
        FROM fines
        WHERE fine_id = $1
    `, [fineId]);

    return result.rows[0];
};

const createFine = async (fine) => {
    if (fine.loanId) {
        const loanResult = await pool.query(
            "SELECT loan_id FROM loans WHERE loan_id = $1",
            [fine.loanId]
        );

        if (loanResult.rows.length === 0) {
            throw new Error("LOAN_NOT_FOUND");
        }
    }

    const idResult = await pool.query(`
        SELECT COALESCE(
            MAX(CAST(SUBSTRING(fine_id FROM 4) AS INTEGER)),
            2000
        ) + 1 AS next_id
        FROM fines
        WHERE fine_id LIKE 'FN-%'
    `);

    const fineId = `FN-${idResult.rows[0].next_id}`;

    const result = await pool.query(`
        INSERT INTO fines (
            fine_id,
            borrower_id,
            borrower_type,
            loan_id,
            amount,
            reason,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            'UNPAID'
        )
        RETURNING
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            loan_id AS "loanId",
            amount,
            reason,
            status
    `, [
        fineId,
        fine.borrowerId,
        fine.borrowerType,
        fine.loanId || null,
        fine.amount,
        fine.reason
    ]);

    return result.rows[0];
};

const updateFine = async (fineId, fine) => {
    const result = await pool.query(`
        UPDATE fines
        SET status = $1
        WHERE fine_id = $2
        RETURNING
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            loan_id AS "loanId",
            amount,
            reason,
            status
    `, [
        fine.status,
        fineId
    ]);

    return result.rows[0];
};

module.exports = {
    getAllFines,
    getFineById,
    createFine,
    updateFine
};