const test = require("node:test");
const assert = require("node:assert/strict");

process.env.REGISTRAR_MODE = "mock";
const registrarService = require("../src/services/registrar.service");

test("mock Registrar returns the configured sample student", async () => {
    const student = await registrarService.getStudent("202610897");
    assert.equal(student.studentId, "202610897");
    assert.equal(student.status, "ENROLLED");
});

test("mock Registrar permits an enrolled student", async () => {
    const result = await registrarService.verifyStudentEligibility("202610897");
    assert.equal(result.eligible, true);
    assert.equal(result.mode, "mock");
});

test("mock Registrar blocks an inactive student", async () => {
    await assert.rejects(
        registrarService.verifyStudentEligibility("202610899"),
        { message: "STUDENT_NOT_ELIGIBLE" }
    );
});

test("mock Registrar rejects an unknown student", async () => {
    await assert.rejects(
        registrarService.verifyStudentEligibility("not-a-student"),
        { message: "REGISTRAR_STUDENT_NOT_FOUND" }
    );
});
