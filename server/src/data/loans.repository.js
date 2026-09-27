const pool = require("../config/database");

const getAllLoans = async (filters = {}) => {
    let query = `
        SELECT
            loan_id AS "loanId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            book_id AS "bookId",
            borrowed_date AS "borrowedDate",
            due_date AS "dueDate",
            returned_date AS "returnedDate",
            status
        FROM loans
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

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY loan_id";

    const result = await pool.query(query, values);

    return result.rows;
};

const getLoanById = async (loanId) => {
    const result = await pool.query(`
        SELECT
            loan_id AS "loanId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            book_id AS "bookId",
            borrowed_date AS "borrowedDate",
            due_date AS "dueDate",
            returned_date AS "returnedDate",
            status
        FROM loans
        WHERE loan_id = $1
    `, [loanId]);

    return result.rows[0];
};

const createLoan = async (loan) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const bookResult = await client.query(`
            SELECT available_quantity
            FROM books
            WHERE book_id = $1
            FOR UPDATE
        `, [loan.bookId]);

        if (bookResult.rows.length === 0) {
            throw new Error("BOOK_NOT_FOUND");
        }

        if (bookResult.rows[0].available_quantity <= 0) {
            throw new Error("BOOK_NOT_AVAILABLE");
        }

        const idResult = await client.query(`
            SELECT COALESCE(
                MAX(CAST(SUBSTRING(loan_id FROM 4) AS INTEGER)),
                5000
            ) + 1 AS next_id
            FROM loans
            WHERE loan_id LIKE 'LN-%'
        `);

        const loanId = `LN-${idResult.rows[0].next_id}`;

        const result = await client.query(`
            INSERT INTO loans (
                loan_id,
                borrower_id,
                borrower_type,
                book_id,
                borrowed_date,
                due_date,
                status
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '14 days',
                'BORROWED'
            )
            RETURNING
                loan_id AS "loanId",
                borrower_id AS "borrowerId",
                borrower_type AS "borrowerType",
                book_id AS "bookId",
                borrowed_date AS "borrowedDate",
                due_date AS "dueDate",
                returned_date AS "returnedDate",
                status
        `, [
            loanId,
            loan.borrowerId,
            loan.borrowerType,
            loan.bookId
        ]);

        await client.query(`
            UPDATE books
            SET
                available_quantity = available_quantity - 1,
                status = CASE
                    WHEN available_quantity - 1 <= 0
                    THEN 'UNAVAILABLE'
                    ELSE 'AVAILABLE'
                END
            WHERE book_id = $1
        `, [loan.bookId]);

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const updateLoan = async (loanId, loan) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get the current loan
        const loanResult = await client.query(`
            SELECT
                loan_id,
                book_id,
                status
            FROM loans
            WHERE loan_id = $1
            FOR UPDATE
        `, [loanId]);

        if (loanResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const currentLoan = loanResult.rows[0];

        // Update the loan
        const result = await client.query(`
            UPDATE loans
            SET
                returned_date = $1,
                status = $2
            WHERE loan_id = $3
            RETURNING
                loan_id AS "loanId",
                borrower_id AS "borrowerId",
                borrower_type AS "borrowerType",
                book_id AS "bookId",
                borrowed_date AS "borrowedDate",
                due_date AS "dueDate",
                returned_date AS "returnedDate",
                status
        `, [
            loan.returnedDate,
            loan.status,
            loanId
        ]);

        // If the book is being returned for the first time,
        // increase its available quantity.
        if (
            loan.status === "RETURNED" &&
            currentLoan.status !== "RETURNED"
        ) {
            await client.query(`
                UPDATE books
                SET
                    available_quantity = available_quantity + 1,
                    status = 'AVAILABLE'
                WHERE book_id = $1
            `, [currentLoan.book_id]);
        }

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const deleteLoan = async (loanId) => {
    const result = await pool.query(`
        DELETE FROM loans
        WHERE loan_id = $1
        RETURNING loan_id AS "loanId"
    `, [loanId]);

    return result.rows[0];
};

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan
};