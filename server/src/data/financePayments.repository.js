const pool = require("../config/database");

const getAllPayments = async (filters = {}) => {
    let query = `
        SELECT
            payment_id AS "paymentId",
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            amount,
            payment_method AS "paymentMethod",
            payment_reference AS "paymentReference",
            paid_date AS "paidDate",
            status
        FROM finance_payments
    `;

    const values = [];
    const conditions = [];

    if (filters.fineId) {
        values.push(filters.fineId);
        conditions.push(`fine_id = $${values.length}`);
    }

    if (filters.borrowerId) {
        values.push(filters.borrowerId);
        conditions.push(`borrower_id = $${values.length}`);
    }

    if (filters.borrowerType) {
        values.push(filters.borrowerType);
        conditions.push(`borrower_type = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY payment_id";

    const result = await pool.query(query, values);

    return result.rows;
};

const getPaymentById = async (paymentId) => {
    const result = await pool.query(`
        SELECT
            payment_id AS "paymentId",
            fine_id AS "fineId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            amount,
            payment_method AS "paymentMethod",
            payment_reference AS "paymentReference",
            paid_date AS "paidDate",
            status
        FROM finance_payments
        WHERE payment_id = $1
    `, [paymentId]);

    return result.rows[0];
};

const createPayment = async (payment) => {
    const fineResult = await pool.query(
        `SELECT fine_id, status
         FROM fines
         WHERE fine_id = $1`,
        [payment.fineId]
    );

    if (fineResult.rows.length === 0) {
        throw new Error("FINE_NOT_FOUND");
    }

    if (fineResult.rows[0].status === "PAID") {
        throw new Error("FINE_ALREADY_PAID");
    }

    const idResult = await pool.query(`
        SELECT COALESCE(
            MAX(CAST(SUBSTRING(payment_id FROM 5) AS INTEGER)),
            3000
        ) + 1 AS next_id
        FROM finance_payments
        WHERE payment_id LIKE 'PAY-%'
    `);

    const paymentId = `PAY-${idResult.rows[0].next_id}`;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(`
            INSERT INTO finance_payments (
                payment_id,
                fine_id,
                borrower_id,
                borrower_type,
                amount,
                payment_method,
                payment_reference,
                paid_date,
                status
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                CURRENT_TIMESTAMP,
                'PAID'
            )
            RETURNING
                payment_id AS "paymentId",
                fine_id AS "fineId",
                borrower_id AS "borrowerId",
                borrower_type AS "borrowerType",
                amount,
                payment_method AS "paymentMethod",
                payment_reference AS "paymentReference",
                paid_date AS "paidDate",
                status
        `, [
            paymentId,
            payment.fineId,
            payment.borrowerId,
            payment.borrowerType,
            payment.amount,
            payment.paymentMethod,
            payment.paymentReference || null
        ]);

        await client.query(`
            UPDATE fines
            SET status = 'PAID'
            WHERE fine_id = $1
        `, [payment.fineId]);

        await client.query("COMMIT");

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment
};