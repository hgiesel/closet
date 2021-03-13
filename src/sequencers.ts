import type { TagNode, Internals, Eval, Un } from "./types";
import type { SortInStrategy } from "./sortInStrategies";

import { sortWithIndices } from "./utils";

const sequencer = <T extends Record<string, unknown>, V>(
    // identifies each unit (tag) receiving shuffled items
    unitId: string,
    // identifies each collection of items being shuffled
    sequenceId: string,
    strategy: (indices: number[], toLength: number) => number[],
    getValues: Eval<T, V[]>,
): Eval<T, V[] | void> => (
    tag: TagNode,
    internals: Internals<T>,
): V[] | void => {
    const applyKey = `${unitId}:apply`;
    // in cache: boolean whether ready for application
    // in deferred: sets apply key true, deletes unitId from waitingSet

    const lengthKey = `${unitId}:length`;
    // in cache: number of values the unit contributed to the sequence

    const waitingSetKey = `${sequenceId}:waitingSet`;
    // in cache: Set with all tags (contains unitId) who wait for their inner sets to be ready

    const shuffleKey = `${sequenceId}:shuffle`;
    // in cache: holds all string values for one fullKey; will be empty after it's done
    // in memory: hold sorting indices, which are used as basis for shuffling
    // in deferred: tries to shuffle cache[shuffleKey], stops if waitingSet is not empty

    /////////// APPLY LOGIC
    if (internals.cache.get(applyKey, false)) {
        const waitingSet = internals.cache.get(waitingSetKey, new Set()) as Set<
            string
        >;
        if (waitingSet.size > 0) {
            // continue waiting for other tags with same fullKey
            return;
        }

        const popped: V[] = [];

        const possibleValues = internals.cache.get(shuffleKey, []) as V[];
        const valueLength = internals.cache.get(lengthKey, 0);

        for (let x = 0; x < valueLength; x++) {
            // pop off start, so the result is the same as in program logic
            const shiftedValue = possibleValues.shift();

            if (shiftedValue) {
                popped.push(shiftedValue);
            }
        }

        return popped;
    }

    /////////// ADD TO SHUFFLE KEY LOGIC
    if (!internals.ready) {
        // add to waitingSet
        internals.cache.over(
            waitingSetKey,
            (s: Set<string>) => s.add(unitId),
            new Set(),
        );
        return;
    }

    // each unit should only continue past this point once
    const values = getValues(tag, internals);

    if (values.length === 0) {
        // no need to shuffle an empty unit
        return values;
    }

    internals.cache.fold(shuffleKey, (v: V[]) => v.concat(values), []);
    internals.cache.set(lengthKey, values.length);

    /////////// TRY TO SHUFFLE FROM DEFERRED LOGIC
    // needs to be executed per individual tag, because of applyKey
    internals.deferred.registerIfNotExists(
        applyKey,
        () => {
            internals.cache.set(applyKey, true);
            internals.cache.over(
                waitingSetKey,
                (set: Set<string>) => set.delete(unitId),
                new Set(),
            );
        },
        {
            priority: 65 /* is higher than ordering 35 */,
        },
    );

    // needs to be executed once per fullKey
    internals.deferred.registerIfNotExists(shuffleKey, () => {
        if (
            internals.cache.over(
                waitingSetKey,
                (waitingSet) => waitingSet.size > 0,
                new Set(),
            )
        ) {
            return;
        }
        // will only go go beyong this point for the last set that becomes ready
        // because shuffling only needs to be done once

        internals.cache.fold(
            shuffleKey,
            <V>(vs: V[]) => {
                const sortingIndices = internals.memory.fold(
                    shuffleKey,
                    (vs: number[]) => {
                        return strategy(
                            vs,
                            internals.cache.get(shuffleKey, []).length,
                        );
                    },
                    [],
                );

                return sortWithIndices(vs, sortingIndices);
            },
            [],
        );
    });
};

const sequenceTemplate = <T extends Record<string, unknown>>(
    makeKeywords: Eval<T, [string, string]>,
) => <V extends [...any[]]>(
    getValues: Eval<T, V[]>,
    sortIn: SortInStrategy,
): Eval<T, V[] | void> => (
    tag: TagNode,
    internals: Internals<T>,
): V[] | void => {
    const sequencesKey = "sequences";
    // in cache: list of all sequences

    const [uid, sequenceId] = makeKeywords(tag, internals);

    internals.cache.over(
        sequencesKey,
        (sequences: string[]) => {
            if (!sequences.includes(sequenceId)) {
                sequences.push(sequenceId);
            }
        },
        [],
    );

    return sequencer(uid, sequenceId, sortIn, getValues)(tag, internals);
};

const within = <T extends Un>(
    { fullKey, fullOccur }: TagNode,
    _internals: Internals<T>,
): [string, string] => [`${fullKey}:${fullOccur}`, `${fullKey}:${fullOccur}`];

const across = <T extends Un>(
    { fullKey, fullOccur }: TagNode,
    _internals: Internals<T>,
): [string, string] => [`${fullKey}:${fullOccur}`, fullKey];

const acrossNumbered = <T extends Un>(
    { fullKey, fullOccur, num }: TagNode,
    _internals: Internals<T>,
): [string, string] => [
    `${fullKey}:${fullOccur}`,
    num ? fullKey : `${fullKey}:${fullOccur}`,
];

const customWithin = (custom: string) => <T extends Un>(
    { fullKey, fullOccur, num }: TagNode,
    _internals: Internals<T>,
): [string, string] => [
    `${fullKey}:${fullOccur}`,
    `${custom}${num}:${fullOccur}`,
];

const customAcross = (custom: string) => <T extends Un>(
    { fullKey, fullOccur, num }: TagNode,
    _internals: Internals<T>,
): [string, string] => [`${fullKey}:${fullOccur}`, `${custom}${num}`];

const customAcrossNumbered = (custom: string) => <T extends Un>(
    { fullKey, fullOccur, num }: TagNode,
    _internals: Internals<T>,
): [string, string] => {
    const customKey = `${custom}${num}`;
    return [
        `${fullKey}:${fullOccur}`,
        num ? customKey : `${customKey}:${fullOccur}`,
    ];
};

export const withinTag = sequenceTemplate(within);
export const acrossTag = sequenceTemplate(across);
export const acrossNumberedTag = sequenceTemplate(acrossNumbered);
export const withinCustom = (custom: string) =>
    sequenceTemplate(customWithin(custom));
export const acrossCustom = (custom: string) =>
    sequenceTemplate(customAcross(custom));
export const acrossNumberedCustom = (custom: string) =>
    sequenceTemplate(customAcrossNumbered(custom));
