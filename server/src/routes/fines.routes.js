const express = require("express");
const fineService = require("../services/fines.service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const fines = await fineService.getFines({
            borrowerType: req.query.borrowerType,
            borrowerId: req.query.borrowerId,
            status: req.query.status
        });

        res.status(200).json(fines);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve fines"
        });
    }
});

router.get("/:fineId", async (req, res) => {
    try {
        const fine = await fineService.getFine(req.params.fineId);

        if (!fine) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Fine not found"
            });
        }

        res.status(200).json(fine);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve fine"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const fine = await fineService.addFine(req.body);

        res.status(201).json(fine);
    } catch (error) {
        console.error(error);

        if (error.message === "LOAN_NOT_FOUND") {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Loan not found"
            });
        }

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to create fine"
        });
    }
});

router.put("/:fineId", async (req, res) => {
    try {
        const fine = await fineService.updateFine(
            req.params.fineId,
            req.body
        );

        if (!fine) {
            return res.status(404).json({
                statusCode: 404,
                error: "Not Found",
                message: "Fine not found"
            });
        }

        res.status(200).json(fine);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Failed to update fine"
        });
    }
});

module.exports = router;