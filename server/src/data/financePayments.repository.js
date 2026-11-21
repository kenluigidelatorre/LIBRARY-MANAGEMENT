const pool = require("../config/database");

const paymentColumns = `
    payment_id AS "paymentId",
    fine_id AS "fineId",
    borrower_id AS "borrowerId",
    borrower_type AS "borrowerType",
    amount,
    payment_method AS "paymentMethod",
    payment_reference AS "paymentReference",
    paid_date AS "paidDate",
    status
`;

const getAllPayments = async (filters = {}) => {
    let query = `SELECT ${paymentColumns} FROM finance_payments`;
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
    if (conditions.length) query += ` WHERE ${conditions.join(" AND ")}`;
    query += " ORDER BY paid_date DESC, payment_id";
    const result = await pool.query(query, values);
    return result.rows;
};

const getPaymentById = async (paymentId) => {
    const result = await pool.query(
        `SELECT ${paymentColumns} FROM finance_payments WHERE payment_id = $1`,
        [paymentId]
    );
    return result.rows[0] || null;
};

const recordConfirmedPayment = async (payment) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock($1)", [741852963]);

        const fineResult = await client.query(
            `SELECT fine_id, borrower_id, borrower_type, amount, status
             FROM fines WHERE fine_id = $1 FOR UPDATE`,
            [payment.fineId]
        );
        const fine = fineResult.rows[0];
        if (!fine) throw new Error("FINE_NOT_FOUND");
        if (fine.status === "PAID") throw new Error("FINE_ALREADY_PAID");
        if (fine.status === "WAIVED") throw new Error("FINE_WAIVED");
        if (String(fine.borrower_id) !== String(payment.borrowerId) || fine.borrower_type !== payment.borrowerType) {
            throw new Error("PAYMENT_BORROWER_MISMATCH");
        }
        if (Number(fine.amount) !== Number(payment.amount)) throw new Error("PAYMENT_AMOUNT_MISMATCH");

        const idResult = await client.query(`
            SELECT COALESCE(MAX(CAST(SUBSTRING(payment_id FROM 5) AS INTEGER)), 3000) + 1 AS next_id
            FROM finance_payments
            WHERE payment_id ~ '^PAY-[0-9]+$'
        `);
        const paymentId = `PAY-${idResult.rows[0].next_id}`;

        const inserted = await client.query(`
            INSERT INTO finance_payments (
                payment_id, fine_id, borrower_id, borrower_type, amount,
                payment_method, payment_reference, paid_date, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 'PAID')
            RETURNING ${paymentColumns}
        `, [
            paymentId,
            payment.fineId,
            payment.borrowerId,
            payment.borrowerType,
            payment.amount,
            payment.paymentMethod,
            payment.paymentReference
        ]);

        await client.query("UPDATE fines SET status = 'PAID' WHERE fine_id = $1", [payment.fineId]);
        await client.query("COMMIT");
        return { ...inserted.rows[0], mode: "live", simulated: false };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { getAllPayments, getPaymentById, recordConfirmedPayment };
