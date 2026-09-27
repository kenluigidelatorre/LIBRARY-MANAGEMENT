const express = require("express");
const paymentService = require("../services/financePayments.service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const payments = await paymentService.getPayments({
            fineId: req.query.fineId,
            borrowerId: req.query.borrowerId,
            borrowerType: req.query.borrowerType
        });

        res.status(200).json(payments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve payments"
        });
    }
});

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

        res.status(200).json(payment);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve payment"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const payment = await paymentService.addPayment(req.body);

        res.status(201).json(payment);
    } catch (error) {
        console.error(error);

        if (error.message === "FINE_NOT_FOUND") {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Fine not found"
            });
        }

        if (error.message === "FINE_ALREADY_PAID") {
            return res.status(409).json({
                statusCode: 409,
                error: "Conflict",
                message: "Fine has already been paid"
            });
        }

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to create payment"
        });
    }
});

module.exports = router;