const express = require("express");
const bookService = require("../services/bookService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const books = await bookService.getBooks();

        res.status(200).json(books);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve books"
        });
    }
});

router.get("/:bookId", async (req, res) => {
    try {
        const book = await bookService.getBook(req.params.bookId);

        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve book"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const book = await bookService.addBook(req.body);

        res.status(201).json(book);
    } catch (error) {
        if (["INVALID_BOOK_INPUT", "INVALID_BOOK_QUANTITY", "INVALID_BOOK_AVAILABILITY", "INVALID_PUBLICATION_YEAR"].includes(error.message)) {
            return res.status(400).json({ statusCode: 400, error: "Bad Request", message: "Provide valid book details, quantities, and publication year" });
        }
        console.error("Book creation error:", error.message);
        res.status(500).json({ statusCode: 500, error: "Internal Server Error", message: "Failed to create book" });
    }
});

router.put("/:bookId", async (req, res) => {
    try {
        const book = await bookService.updateBook(
            req.params.bookId,
            req.body
        );

        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        if (["INVALID_BOOK_INPUT", "INVALID_BOOK_QUANTITY", "INVALID_BOOK_AVAILABILITY", "INVALID_PUBLICATION_YEAR"].includes(error.message)) {
            return res.status(400).json({ statusCode: 400, error: "Bad Request", message: "Provide valid book details, quantities, and publication year" });
        }
        console.error("Book update error:", error.message);
        res.status(500).json({ statusCode: 500, error: "Internal Server Error", message: "Failed to update book" });
    }
});

router.delete("/:bookId", async (req, res) => {
    try {
        const book = await bookService.removeBook(req.params.bookId);

        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully",
            bookId: book.book_id
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to delete book"
        });
    }
});

module.exports = router;