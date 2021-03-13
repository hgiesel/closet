import { TagSelector } from "../../../src/template/tagSelector";

describe("parseTagSelector", () => {
    describe("catch-all patterns", () => {
        test("* matches everything", () => {
            const pred = TagSelector.make("*");

            expect(pred.check("c", 1, 5)).toBeTruthy();
            expect(pred.check("hello", null, 0)).toBeTruthy();
        });

        test("** matches everything", () => {
            const pred = TagSelector.make("**");

            expect(pred.check("c", 1, 5)).toBeTruthy();
            expect(pred.check("hello", null, 0)).toBeTruthy();
        });

        test("**:* matches everything", () => {
            const pred = TagSelector.make("**:*");

            expect(pred.check("c", 1, 5)).toBeTruthy();
            expect(pred.check("hello", null, 0)).toBeTruthy();
        });

        test("*{} matches any text, but no nums", () => {
            const pred = TagSelector.make("*{}");

            expect(pred.check("c", null, 5)).toBeTruthy();
            expect(pred.check("hello", null, 0)).toBeTruthy();
            expect(pred.check("cr", 1, 5)).toBeFalsy();
            expect(pred.check("hella", 2, 0)).toBeFalsy();
        });
    });
});
