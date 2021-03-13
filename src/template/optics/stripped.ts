import type { ProfunctorDict } from "./profunctors";
import type { Optic } from "./utils";
import { WeakCircumfix, weakCircumfixToCircumfix } from "./circumfix";
import { escapeRegExp, regExpString } from "./utils";

export const strippedRegex = (wc: WeakCircumfix): Optic => {
    const { before, after } = weakCircumfixToCircumfix(wc);

    const getter = (text: string): [string, null] => {
        const regex = new RegExp(
            `^${regExpString(before)}(.*?)${regExpString(after)}$`,
            "su",
        );
        let match = text;

        text.replace(regex, (_match: string, inner: string): string => {
            match = inner;
            return "";
        });

        return [match, null];
    };

    const setter = ([repl]: [string, null]): string => {
        return repl;
    };

    return (
        dict: ProfunctorDict,
        f0: (s: string) => string,
    ): ((s: string) => string) => {
        const f1 = dict.first(f0);
        const f2 = dict.dimap(getter, setter, f1 as any);
        return f2 as any;
    };
};

export const stripped = ({
    before,
    after,
}: {
    before: string;
    after: string;
}): Optic =>
    strippedRegex({
        before: `^${escapeRegExp(before)}`,
        after: `${escapeRegExp(after)}$`,
    });
