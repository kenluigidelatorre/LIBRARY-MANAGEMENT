const bookRepository = require("../data/books.repository");

const getBooks = async () => {
    return await bookRepository.getAllBooks();
};

const getBook = async (bookId) => {
    return await bookRepository.getBookById(bookId);
};

const addBook = async (book) => {
    return await bookRepository.createBook(book);
};

const updateBook = async (bookId, book) => {
    return await bookRepository.updateBook(bookId, book);
};

const removeBook = async (bookId) => {
    return await bookRepository.deleteBook(bookId);
};

module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    removeBook
};