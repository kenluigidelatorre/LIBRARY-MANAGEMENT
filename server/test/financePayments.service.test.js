const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

process.env.FINANCE_MODE = "mock";

const fineRepositoryPath = require.resolve("../src/data/fines.repository");
const paymentRepositoryPath = require.resolve("../src/data/financePayments.repository");
let recordConfirmedPaymentCalls = 0;

require.cache[fineRepositoryPath] = {
    id: fineRepositoryPath,
    filename: fineRepositoryPath,
    loaded: true,
    exports: {
        getFineById: async () => ({
            fineId: "FN-2001",
            borrowerId: "202610897",
            borrowerType: "STUDENT",
            amount: "150.00",
            status: "UNPAID"
        })
    }
};

require.cache[paymentRepositoryPath] = {
    id: paymentRepositoryPath,
    filename: paymentRepositoryPath,
    loaded: true,
    exports: {
        getAllPayments: async () => [],
        getPaymentById: async () => null,
        recordConfirmedPayment: async () => {
            recordConfirmedPaymentCalls += 1;
            return { paymentId: "PAY-3001", status: "PAID" };
        }
    }
};

const financeService = require("../src/services/financePayments.service");

test("mock Finance returns SIMULATED and does not persist a payment", async () => {
    recordConfirmedPaymentCalls = 0;
    const result = await financeService.addPayment({
        fineId: "FN-2001",
        borrowerId: "202610897",
        borrowerType: "STUDENT",
        amount: 150,
        paymentMethod: "CASH"
    });

    assert.equal(result.status, "SIMULATED");
    assert.equal(result.simulated, true);
    assert.equal(recordConfirmedPaymentCalls, 0);
});

test("payment request is rejected when the amount differs from the fine", async () => {
    await assert.rejects(
        financeService.addPayment({
            fineId: "FN-2001",
            borrowerId: "202610897",
            borrowerType: "STUDENT",
            amount: 100,
            paymentMethod: "CASH"
        }),
        { message: "PAYMENT_AMOUNT_MISMATCH" }
    );
});
