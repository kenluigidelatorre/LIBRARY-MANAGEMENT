const pool = require("../config/database");

const getAllBooks = async () => {
    const result = await pool.query(`
        SELECT
            book_id AS "bookId",
            isbn,
            title,
            author,
            category,
            publisher,
            publication_year AS "publicationYear",
            quantity,
            available_quantity AS "availableQuantity",
            status
        FROM books
        ORDER BY book_id
    `);

    return result.rows;
};

const getBookById = async (bookId) => {
    const result = await pool.query(`
        SELECT
            book_id AS "bookId",
            isbn,
            title,
            author,
            category,
            publisher,
            publication_year AS "publicationYear",
            quantity,
            available_quantity AS "availableQuantity",
            status
        FROM books
        WHERE book_id = $1
    `, [bookId]);

    return result.rows[0];
};

const createBook = async (book) => {
    const idResult = await pool.query(`
        SELECT COALESCE(
            MAX(CAST(SUBSTRING(book_id FROM 4) AS INTEGER)),
            1000
        ) + 1 AS next_id
        FROM books
        WHERE book_id LIKE 'BK-%'
    `);

    const bookId = `BK-${idResult.rows[0].next_id}`;

    const result = await pool.query(`
        INSERT INTO books (
            book_id,
            title,
            author,
            isbn,
            category,
            publisher,
            publication_year,
            quantity,
            available_quantity,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
        RETURNING
            book_id AS "bookId",
            isbn,
            title,
            author,
            category,
            publisher,
            publication_year AS "publicationYear",
            quantity,
            available_quantity AS "availableQuantity",
            status
    `, [
        bookId,
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.publisher,
        book.publicationYear,
        book.quantity,
        book.quantity > 0 ? "AVAILABLE" : "UNAVAILABLE"
    ]);

    return result.rows[0];
};

const updateBook = async (bookId, book) => {
    const result = await pool.query(`
        UPDATE books
        SET
            isbn = $1,
            title = $2,
            author = $3,
            category = $4,
            publisher = $5,
            publication_year = $6,
            quantity = $7,
            available_quantity = $8,
            status = $9
        WHERE book_id = $10
        RETURNING
            book_id AS "bookId",
            isbn,
            title,
            author,
            category,
            publisher,
            publication_year AS "publicationYear",
            quantity,
            available_quantity AS "availableQuantity",
            status
    `, [
        book.isbn,
        book.title,
        book.author,
        book.category,
        book.publisher,
        book.publicationYear,
        book.quantity,
        book.availableQuantity,
        book.status,
        bookId
    ]);

    return result.rows[0];
};

const deleteBook = async (bookId) => {
    const result = await pool.query(
        "DELETE FROM books WHERE book_id = $1 RETURNING book_id",
        [bookId]
    );

    return result.rows[0];
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};