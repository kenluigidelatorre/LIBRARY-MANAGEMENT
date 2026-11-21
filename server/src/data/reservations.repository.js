const pool = require("../config/database");

const getAllReservations = async (filters = {}) => {
    let query = `
        SELECT
            reservation_id AS "reservationId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            book_id AS "bookId",
            reservation_date AS "reservationDate",
            status
        FROM reservations
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

    query += " ORDER BY reservation_id";

    const result = await pool.query(query, values);

    return result.rows;
};

const getReservationById = async (reservationId) => {
    const result = await pool.query(`
        SELECT
            reservation_id AS "reservationId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            book_id AS "bookId",
            reservation_date AS "reservationDate",
            status
        FROM reservations
        WHERE reservation_id = $1
    `, [reservationId]);

    return result.rows[0];
};

const createReservation = async (reservation) => {
    const bookResult = await pool.query(
        "SELECT book_id FROM books WHERE book_id = $1",
        [reservation.bookId]
    );

    if (bookResult.rows.length === 0) {
        throw new Error("BOOK_NOT_FOUND");
    }

    const idResult = await pool.query(`
        SELECT COALESCE(
            MAX(CAST(SUBSTRING(reservation_id FROM 4) AS INTEGER)),
            3000
        ) + 1 AS next_id
        FROM reservations
        WHERE reservation_id LIKE 'RS-%'
    `);

    const reservationId = `RS-${idResult.rows[0].next_id}`;

    const result = await pool.query(`
        INSERT INTO reservations (
            reservation_id,
            borrower_id,
            borrower_type,
            book_id,
            reservation_date,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            CURRENT_TIMESTAMP,
            'PENDING'
        )
        RETURNING
            reservation_id AS "reservationId",
            borrower_id AS "borrowerId",
            borrower_type AS "borrowerType",
            book_id AS "bookId",
            reservation_date AS "reservationDate",
            status
    `, [
        reservationId,
        reservation.borrowerId,
        reservation.borrowerType,
        reservation.bookId
    ]);

    return result.rows[0];
};

const deleteReservation = async (reservationId) => {
    const result = await pool.query(`
        DELETE FROM reservations
        WHERE reservation_id = $1
        RETURNING reservation_id AS "reservationId"
    `, [reservationId]);

    return result.rows[0];
};

module.exports = {
    getAllReservations,
    getReservationById,
    createReservation,
    deleteReservation
};