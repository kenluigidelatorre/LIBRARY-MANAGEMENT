const bookRepository = require("../data/books.repository");

const getBooks = async () => bookRepository.getAllBooks();
const getBook = async (bookId) => bookRepository.getBookById(bookId);

const validateBook = (book, isUpdate = false) => {
    if (!book || !String(book.title || "").trim() || !String(book.author || "").trim()) {
        throw new Error("INVALID_BOOK_INPUT");
    }
    const quantity = Number(book.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error("INVALID_BOOK_QUANTITY");
    if (isUpdate) {
        const availableQuantity = Number(book.availableQuantity);
        if (!Number.isInteger(availableQuantity) || availableQuantity < 0 || availableQuantity > quantity) {
            throw new Error("INVALID_BOOK_AVAILABILITY");
        }
    }
    if (book.publicationYear !== undefined && book.publicationYear !== null && book.publicationYear !== "") {
        const year = Number(book.publicationYear);
        if (!Number.isInteger(year) || year < 1000 || year > 2100) throw new Error("INVALID_PUBLICATION_YEAR");
    }
};

const addBook = async (book) => {
    validateBook(book);
    return bookRepository.createBook(book);
};

const updateBook = async (bookId, book) => {
    validateBook(book, true);
    return bookRepository.updateBook(bookId, book);
};

const removeBook = async (bookId) => bookRepository.deleteBook(bookId);

module.exports = { getBooks, getBook, addBook, updateBook, removeBook };
