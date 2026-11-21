
const express = require("express");
const paymentService = require("../services/financePayments.service");

const router = express.Router();

// GET /api/finance/payments
router.get("/", async (req, res) => {
    try {
        const payments = await paymentService.getPayments({
            fineId: req.query.fineId,
            borrowerId: req.query.borrowerId,
            borrowerType: req.query.borrowerType
        });

        return res.status(200).json(payments);

    } catch (error) {
        console.error("Payment retrieval error:", error.message);

        return res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve payments"
        });
    }
});

// GET /api/finance/payments/:paymentId
router.get("/:paymentId", async (req, res) => {
    try {
        const payment = await paymentService.getPayment(
            req.params.paymentId
        );

        if (!payment) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Payment not found"
            });
        }

        return res.status(200).json(payment);

    } catch (error) {
        console.error("Payment lookup error:", error.message);

        return res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve payment"
        });
    }
});

// POST /api/finance/payments
router.post("/", async (req, res) => {
    try {
        const {
            fineId,
            borrowerId,
            borrowerType,
            amount,
            paymentMethod
        } = req.body || {};

        if (
            !fineId ||
            !borrowerId ||
            amount === undefined ||
            amount === null ||
            !paymentMethod ||
            !borrowerType
        ) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: "fineId, borrowerId, borrowerType, amount, and paymentMethod are required"
            });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: "amount must be a valid positive number"
            });
        }

        const normalizedType = String(borrowerType).toUpperCase();
        const normalizedMethod = String(paymentMethod).toUpperCase();

        if (!["STUDENT", "FACULTY"].includes(normalizedType)) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: "borrowerType must be STUDENT or FACULTY"
            });
        }

        if (!["CASH", "GCASH", "BANK_TRANSFER"].includes(normalizedMethod)) {
            return res.status(400).json({
                statusCode: 400,
                error: "Bad Request",
                message: "paymentMethod must be CASH, GCASH, or BANK_TRANSFER"
            });
        }

        const result = await paymentService.addPayment({
            fineId: String(fineId),
            borrowerId: String(borrowerId),
            borrowerType: normalizedType,
            amount: Number(amount),
            paymentMethod: normalizedMethod,
            paymentReference: req.body.paymentReference
                ? String(req.body.paymentReference)
                : null
        });

        const statusCode =
            result.status === "SIMULATED" ||
            result.status === "PENDING"
                ? 202
                : 201;

        return res.status(statusCode).json(result);

    } catch (error) {
        const known = {
            FINE_NOT_FOUND: [404, "Fine not found"],
            FINE_ALREADY_PAID: [409, "Fine has already been paid"],
            FINE_WAIVED: [409, "A waived fine cannot be paid"],
            PAYMENT_BORROWER_MISMATCH: [400, "Payment borrower does not match the fine"],
            PAYMENT_AMOUNT_MISMATCH: [400, "Payment amount does not match the fine amount"],
            INVALID_FINANCE_MODE: [500, "FINANCE_MODE must be mock or live"],
            FINANCE_API_BASE_URL_REQUIRED: [503, "FINANCE_API_BASE_URL is required"],
            FINANCE_PAYMENTS_PATH_REQUIRED: [503, "FINANCE_PAYMENTS_PATH is required"],
            INTEGRATION_TIMEOUT: [504, "Finance service request timed out"],
            INTEGRATION_UNAVAILABLE: [502, "Finance service is unavailable"],
            INTEGRATION_INVALID_JSON: [502, "Finance service returned invalid JSON"],
            INTEGRATION_REQUEST_FAILED: [502, "Finance service rejected the payment request"]
        };

        const mapped = known[error.message];

        if (mapped) {
            return res.status(mapped[0]).json({
                statusCode: mapped[0],
                error: mapped[0] >= 500
                    ? "Integration Error"
                    : "Request Error",
                message: mapped[1]
            });
        }

        console.error("Payment processing error:", error.message);

        return res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to process payment"
        });
    }
});

module.exports = router;
