import { interspliceChildNodes } from "../dist/src/browserUtils.js";

const assert = chai.assert;

describe("interspliceChildNodes", () => {
    before(() => {
        const parent = document.querySelector("#intersplicetest");
        assert.strictEqual(
            parent.childNodes.length,
            15,
            "parent has wrong childNodes",
        );
    });

    it("finds individual nodes", () => {
        const parent = document.querySelector("#intersplicetest");
        const test = interspliceChildNodes(parent, {
            type: "predicate",
            value: (v) => v.className === "foo",
        });

        assert.lengthOf(test, 3, "should have 3 child nodes");
    });

    it("finds subspan from nodes", () => {
        const parent = document.querySelector("#intersplicetest");
        const test = interspliceChildNodes(parent, {
            type: "predicate",
            value: (v) =>
                v.className === "bar" || v.nodeType === Node.TEXT_NODE,
        });

        assert.lengthOf(test, 3, "should have 3 child nodes");
    });
});
