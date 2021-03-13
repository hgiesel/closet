import { shuffle } from "./utils";

export type SortInStrategy = (indices: number[], toLength: number) => number[];

export const topUp: SortInStrategy = (
    indices: number[],
    toLength: number,
): number[] => {
    /**
     * topUpSortingIndices([0,1], 4) => [0,1,2,3] or [0,1,3,2]
     */

    if (indices.length >= toLength) {
        // indices already have sufficient length
        return indices;
    }

    const newIndices = shuffle(
        Array.from(
            new Array(toLength - indices.length),
            (_x: undefined, i: number) => i + indices.length,
        ),
    );

    const result = [...indices, ...newIndices];

    return result;
};

export const mixIn: SortInStrategy = (
    indices: number[],
    toLength: number,
): number[] => {
    /**
     * topUpSortingIndices([0,1], 4) => [2,3,0,1], [2,0,3,1], [0,1,2,3], [0,1,3,2], etc.
     */

    if (indices.length >= toLength) {
        // indices already have sufficient length
        return indices;
    }

    const newIndices = Array.from(
        new Array(toLength - indices.length),
        (_x: undefined, i: number) => i + indices.length,
    );

    const result = [...indices];
    newIndices.forEach((newIndex: number) =>
        result.splice(
            Math.floor(
                Math.random() * (result.length + 1),
            ) /* possible insertion positions */,
            0,
            newIndex,
        ),
    );

    return result;
};
