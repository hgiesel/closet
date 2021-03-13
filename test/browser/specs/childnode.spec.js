import { ChildNodeSpan } from "../dist/src/browserUtils.js";

const assert = chai.assert;

describe("ChildNodeSpan", () => {
    before(() => {
        const parent = document.querySelector("#childnodetest > .first");
        assert.strictEqual(
            parent.childNodes.length,
            9,
            "parent has wrong childNodes",
        );
    });

    it("defaults to the whole span", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(parent);

        assert.strictEqual(test.from, 0, "from is not set correctly");
        assert.strictEqual(test.to, 8, "to is not set correctly");
    });

    it("can be set via index arg", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "index",
                value: 0,
            },
            {
                type: "index",
                value: 3,
            },
        );

        assert.strictEqual(test.from, 0, "from is not set correctly");
        assert.strictEqual(test.to, 3, "to is not set correctly");
    });

    it("can be set via element arg", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const startElement = document.querySelector(
            "#childnodetest > .first > #first-start-here",
        );
        const endElement = document.querySelector(
            "#childnodetest > .first > #first-end-here",
        );

        const test = new ChildNodeSpan(
            parent,
            {
                type: "node",
                value: startElement,
            },
            {
                type: "node",
                value: endElement,
            },
        );

        assert.strictEqual(test.from, 1, "from is not set correctly");
        assert.strictEqual(test.to, 5, "to is not set correctly");
    });

    it("can be set via predicate arg", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.id === "first-start-here",
            },
            {
                type: "predicate",
                value: (v) => v.id === "first-end-here",
            },
        );

        assert.strictEqual(test.from, 1, "from is not set correctly");
        assert.strictEqual(test.to, 5, "to is not set correctly");
    });

    it("respects exclusive argument", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.id === "first-start-here",
                exclusive: true,
            },
            {
                type: "predicate",
                value: (v) => v.id === "first-end-here",
                exclusive: true,
            },
        );

        assert.strictEqual(test.from, 2, "from is not set correctly");
        assert.strictEqual(test.to, 4, "to is not set correctly");
    });

    it("exclusive can make span length to 1", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.id === "first-start-here",
                exclusive: true,
            },
            {
                type: "predicate",
                value: (v) => v.id === "first-very-close",
                exclusive: true,
            },
        );

        assert.strictEqual(test.from, 2, "from is not set correctly");
        assert.strictEqual(test.to, 2, "to is not set correctly");
    });

    it("exclusive breaks if just one apart", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.id === "first-start-here",
                exclusive: true,
            },
            {
                type: "predicate",
                value: (v) =>
                    v.previousSibling &&
                    v.previousSibling.id === "first-start-here",
                exclusive: true,
            },
        );

        assert.isFalse(test.valid, "should be invalid");
    });

    it("respects startAtIndex with index argument", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "index",
                value: 0,
                startAtIndex: 0,
            },
            {
                type: "index",
                value: 0,
                startAtIndex: 3,
            },
        );

        assert.strictEqual(test.from, 0, "from is not set correctly");
        assert.strictEqual(test.to, 3, "to is not set correctly");
    });

    it("respects startAtIndex with predicate argument", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.className === "foo",
                startAtIndex: 2,
            },
            {
                type: "predicate",
                value: (v) => v.className === "foo",
                startAtIndex: 4,
            },
        );

        assert.strictEqual(test.from, 3, "from is not set correctly");
        assert.strictEqual(test.to, 7, "to is not set correctly");
    });

    it("respects automatic startAtIndex at to argument", () => {
        const parent = document.querySelector("#childnodetest > .first");
        const test = new ChildNodeSpan(
            parent,
            {
                type: "predicate",
                value: (v) => v.className === "foo",
                startAtIndex: 2,
            },
            {
                type: "predicate",
                value: (v) => v.className === "foo",
            },
        );

        assert.strictEqual(test.from, 3, "from is not set correctly");
        assert.strictEqual(test.to, 3, "to is not set correctly");
    });
});
