import type { TagNode, Registrar, Internals } from "../types";

import { sortWithIndices } from "../utils";
import { topUp } from "../sortInStrategies";
import { TagSelector } from "../template";

import { separated, mapped } from "../template/optics";

const adjustOptions = {
    priority: 35 /* must be higher than sequencers 15 */,
    persistent: true,
};

const orderingOptics = [separated("::"), mapped(), separated(",")];

export const orderingRecipe = ({
    tagname = "ord",
    optics = orderingOptics,
    sortInStrategy = topUp,
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const ordFilter = (
        tag: TagNode,
        { deferred, cache, memory }: Internals<T>,
    ) => {
        /**
         * @param tag.values must contain lists of *tag selectors* for sequence ids
         */

        const sequencesKey = "sequences";
        const sequences = new Set<string>(cache.get(sequencesKey, []));

        for (const [idx, cmd] of tag.values.entries()) {
            const selectors = cmd.map(TagSelector.make);
            const ordKey = `${tag.key}:${tag.fullOccur}:ord:${idx}`;

            const adjustOrder = () => {
                const remainingSequences = Array.from(sequences);
                const activeSequences = remainingSequences.filter(
                    (sequenceId: string) => {
                        if (
                            selectors.some((selector: TagSelector) =>
                                selector.checkTagIdentifier(sequenceId),
                            )
                        ) {
                            sequences.delete(sequenceId);
                            return true;
                        }

                        return false;
                    },
                );

                const activeShuffleKeys = activeSequences.map(
                    (sequenceId: string) => `${sequenceId}:shuffle`,
                );

                for (const [index, sequenceId] of activeSequences.entries()) {
                    const shuffleKey = activeShuffleKeys[index];
                    const waitingSetKey = `${sequenceId}:waitingSet`;

                    deferred.block(shuffleKey);

                    const waitingSet = cache.get<Set<string>>(
                        waitingSetKey,
                        new Set(),
                    );

                    if (waitingSet.size !== 0) {
                        continue;
                    }

                    const presetShuffle = activeShuffleKeys.reduce(
                        (accu: number[], sk: string) => {
                            const nextShuffleOrder = memory.get(sk, []);
                            return accu.length < nextShuffleOrder.length
                                ? nextShuffleOrder
                                : accu;
                        },
                        [],
                    );

                    const shuffleItems = cache.get<string[]>(shuffleKey, []);

                    const toppedUpIndices = sortInStrategy(
                        cache.get<number[]>(ordKey, presetShuffle),
                        shuffleItems.length,
                    );

                    // order mix items
                    cache.fold(
                        shuffleKey,
                        (vs: string[]) => sortWithIndices(vs, toppedUpIndices),
                        [],
                    );

                    // possibly update with longer sort order
                    cache.set(ordKey, toppedUpIndices);
                    memory.set(shuffleKey, toppedUpIndices);
                }

                // need to remove ord deferred because it is persistent
                if (sequences.size === 0) {
                    deferred.unregister(ordKey);
                }
            };

            deferred.register(ordKey, adjustOrder, adjustOptions);
        }

        return { ready: true };
    };

    registrar.register(tagname, ordFilter, { optics });
};
