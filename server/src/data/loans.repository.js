const pool = require("../config/database");

const loanColumns = `
    loan_id AS "loanId",
    borrower_id AS "borrowerId",
    borrower_type AS "borrowerType",
    book_id AS "bookId",
    borrowed_date AS "borrowedDate",
    due_date AS "dueDate",
    returned_date AS "returnedDate",
    status
`;

const getAllLoans = async (filters = {}) => {
    let query = `SELECT ${loanColumns} FROM loans`;
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
    if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;
    query += " ORDER BY borrowed_date DESC, loan_id";
    const result = await pool.query(query, values);
    return result.rows;
};

const getLoanById = async (loanId) => {
    const result = await pool.query(`SELECT ${loanColumns} FROM loans WHERE loan_id = $1`, [loanId]);
    return result.rows[0] || null;
};

const createLoan = async (loan) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const bookResult = await client.query(
            "SELECT available_quantity FROM books WHERE book_id = $1 FOR UPDATE",
            [loan.bookId]
        );
        if (!bookResult.rows.length) throw new Error("BOOK_NOT_FOUND");
        if (Number(bookResult.rows[0].available_quantity) <= 0) throw new Error("BOOK_NOT_AVAILABLE");

        await client.query("SELECT pg_advisory_xact_lock($1)", [741852964]);
        const idResult = await client.query(`
            SELECT COALESCE(MAX(CAST(SUBSTRING(loan_id FROM 4) AS INTEGER)), 5000) + 1 AS next_id
            FROM loans WHERE loan_id ~ '^LN-[0-9]+$'
        `);
        const loanId = `LN-${idResult.rows[0].next_id}`;
        const inserted = await client.query(`
            INSERT INTO loans (loan_id, borrower_id, borrower_type, book_id, borrowed_date, due_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'BORROWED')
            RETURNING ${loanColumns}
        `, [loanId, loan.borrowerId, loan.borrowerType, loan.bookId, loan.borrowedDate, loan.dueDate]);

        await client.query(`
            UPDATE books
            SET available_quantity = available_quantity - 1,
                status = CASE WHEN available_quantity - 1 <= 0 THEN 'UNAVAILABLE' ELSE 'AVAILABLE' END
            WHERE book_id = $1
        `, [loan.bookId]);
        await client.query("COMMIT");
        return inserted.rows[0];
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
        const currentResult = await client.query(
            "SELECT loan_id, book_id, status FROM loans WHERE loan_id = $1 FOR UPDATE",
            [loanId]
        );
        if (!currentResult.rows.length) {
            await client.query("ROLLBACK");
            return null;
        }
        const current = currentResult.rows[0];
        if (current.status === "RETURNED" && loan.status !== "RETURNED") throw new Error("LOAN_ALREADY_RETURNED");

        const updated = await client.query(`
            UPDATE loans SET returned_date = $1, status = $2
            WHERE loan_id = $3
            RETURNING ${loanColumns}
        `, [loan.returnedDate, loan.status, loanId]);

        if (loan.status === "RETURNED" && current.status !== "RETURNED") {
            await client.query(`
                UPDATE books
                SET available_quantity = LEAST(quantity, available_quantity + 1),
                    status = CASE WHEN LEAST(quantity, available_quantity + 1) > 0 THEN 'AVAILABLE' ELSE 'UNAVAILABLE' END
                WHERE book_id = $1
            `, [current.book_id]);
        }
        await client.query("COMMIT");
        return updated.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const deleteLoan = async (loanId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const currentResult = await client.query(
            "SELECT loan_id, book_id, status FROM loans WHERE loan_id = $1 FOR UPDATE",
            [loanId]
        );
        if (!currentResult.rows.length) {
            await client.query("ROLLBACK");
            return null;
        }
        const current = currentResult.rows[0];
        const deleted = await client.query(
            "DELETE FROM loans WHERE loan_id = $1 RETURNING loan_id AS \"loanId\"",
            [loanId]
        );
        if (current.status !== "RETURNED") {
            await client.query(`
                UPDATE books
                SET available_quantity = LEAST(quantity, available_quantity + 1),
                    status = CASE WHEN LEAST(quantity, available_quantity + 1) > 0 THEN 'AVAILABLE' ELSE 'UNAVAILABLE' END
                WHERE book_id = $1
            `, [current.book_id]);
        }
        await client.query("COMMIT");
        return deleted.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { getAllLoans, getLoanById, createLoan, updateLoan, deleteLoan };
