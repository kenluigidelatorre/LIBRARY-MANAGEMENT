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
            return res.status(409).json({
                statusCode: 409,
                error: "Conflict",
                message: "Book is not available"
            });
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

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to update loan"
        });
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