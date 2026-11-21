const express = require("express");
const loanService = require("../services/loanService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const loans = await loanService.getLoans({
            borrowerType: req.query.borrowerType,
            borrowerId: req.query.borrowerId
        });

        res.status(200).json(loans);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve loans"
        });
    }
});

router.get("/:loanId", async (req, res) => {
    try {
        const loan = await loanService.getLoan(req.params.loanId);

        if (!loan) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Loan not found"
            });
        }

        res.status(200).json(loan);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve loan"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const loan = await loanService.addLoan(req.body);

        res.status(201).json(loan);
    } catch (error) {
        console.error(error);

        if (error.message === "BOOK_NOT_FOUND") {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Book not found"
            });
        }

        if (error.message === "BOOK_NOT_AVAILABLE") {
            return res.status(409).json({ statusCode: 409, error: "Conflict", message: "Book is not available" });
        }
        if (["INVALID_LOAN_INPUT", "INVALID_BORROWER_TYPE", "INVALID_LOAN_DATES"].includes(error.message)) {
            return res.status(400).json({ statusCode: 400, error: "Bad Request", message: "Provide a valid borrower, book, borrower type, borrowed date, and due date" });
        }
        if (error.message === "REGISTRAR_STUDENT_NOT_FOUND") {
            return res.status(404).json({ statusCode: 404, error: "Not Found", message: "Student was not found in Registrar records" });
        }
        if (error.message === "STUDENT_NOT_ELIGIBLE") {
            return res.status(403).json({ statusCode: 403, error: "Forbidden", message: "Student is not currently enrolled and cannot borrow books" });
        }
        if (["GATEWAY_BASE_URL_REQUIRED", "INVALID_REGISTRAR_MODE", "REGISTRAR_RESPONSE_INVALID", "INTEGRATION_TIMEOUT", "INTEGRATION_UNAVAILABLE", "INTEGRATION_INVALID_JSON", "INTEGRATION_REQUEST_FAILED"].includes(error.message)) {
            return res.status(error.status || 502).json({ statusCode: error.status || 502, error: "Registrar Integration Error", message: "Student eligibility could not be verified. Please try again later." });
        }

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to create loan"
        });
    }
});

router.put("/:loanId", async (req, res) => {
    try {
        const loan = await loanService.updateLoan(
            req.params.loanId,
            req.body
        );

        if (!loan) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Loan not found"
            });
        }

        res.status(200).json(loan);
    } catch (error) {
        console.error(error);

        if (["INVALID_LOAN_STATUS", "INVALID_RETURN_DATE"].includes(error.message)) {
            return res.status(400).json({ statusCode: 400, error: "Bad Request", message: "Provide a valid loan status and return date" });
        }
        if (error.message === "LOAN_ALREADY_RETURNED") {
            return res.status(409).json({ statusCode: 409, error: "Conflict", message: "This loan has already been returned" });
        }
        res.status(500).json({ statusCode: 500, error: "Internal Server Error", message: "Failed to update loan" });
    }
});

router.delete("/:loanId", async (req, res) => {
    try {
        const loan = await loanService.removeLoan(
            req.params.loanId
        );

        if (!loan) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Loan not found"
            });
        }

        res.status(200).json({
            message: "Loan deleted successfully",
            loanId: loan.loanId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to delete loan"
        });
    }
});

module.exports = router;