import type { ProfunctorDict } from "./profunctors";
import type { Optic } from "./utils";

export interface Separator {
    sep: string;
    max: number;
    trim: boolean;
    keepEmpty: boolean;
}

export type WeakSeparator = Partial<Separator> | string;

export const weakSeparatorToSeparator = (ws: WeakSeparator): Separator =>
    typeof ws === "string"
        ? {
              sep: ws,
              max: Infinity,
              trim: false,
              keepEmpty: true,
          }
        : {
              sep: ws.sep ?? "::",
              max: ws.max ?? Infinity,
              trim: ws.trim ?? false,
              keepEmpty: ws.keepEmpty ?? true,
          };

export const separated = (weakSep: WeakSeparator): Optic => {
    const { sep, max, trim, keepEmpty } = weakSeparatorToSeparator(weakSep);

    const getter = (
        text: string,
    ): [string[] /* no value passed to setter */] => {
        const splits = [];
        let textSplit = text;
        let quit = false;

        while (!quit) {
            const pos = textSplit.indexOf(sep);

            const [currentSplit, rest, innerQuit]: [string, string, boolean] =
                pos < 0 || splits.length + 1 === max
                    ? [textSplit, "", true]
                    : [
                          textSplit.slice(0, pos),
                          textSplit.slice(pos + sep.length),
                          false,
                      ];

            const trimmed: string = trim ? currentSplit.trim() : currentSplit;

            if (keepEmpty || trimmed.length >= 1) {
                splits.push(trimmed);
            }

            textSplit = rest;
            quit = innerQuit;
        }

        return [splits];
    };

    const setter = ([val]: [string]): string => {
        return val;
    };

    return (dict: ProfunctorDict, f0: (s: string[]) => string) => {
        const f1 = dict.first(f0);
        const f2 = dict.dimap(getter, setter, f1 as any);
        return f2;
    };
};
