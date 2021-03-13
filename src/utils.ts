export const id = <T>(v: T): T => v;
export const id2 = <T, U>(_v: U, w: T): T => w;
export const constant = <T, U>(x: T) => (_y: U) => x;

export const zeroWidthSpace = "​";

export const shuffle = <T>(array: T[]): T[] => {
    const result = array.slice(0);
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        const temporaryValue: T = result[currentIndex];
        result[currentIndex] = result[randomIndex];
        result[randomIndex] = temporaryValue;
    }

    return result;
};

export const sortWithIndices = <T>(items: T[], indices: number[]): T[] => {
    const result: T[] = [];

    for (const idx of indices) {
        const maybeItem: T = items[idx];

        if (maybeItem) {
            result.push(maybeItem);
        }
    }

    if (indices.length < items.length) {
        const remainingItemIndices: number[] = Array.from(
            new Array(items.length - indices.length),
            (_x, i) => i + indices.length,
        );

        for (const idx of remainingItemIndices) {
            result.push(items[idx]);
        }
    }

    return result;
};
