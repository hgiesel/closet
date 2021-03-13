import type { Registrar, TagNode, Internals } from "../types";

export const debugRecipe = () => <T extends Record<string, unknown>>(
    registrar: Registrar<T>,
) => {
    const pathFilter = (_t: TagNode, { path }: Internals<T>) => path.join(":");

    registrar.register("tagpath", pathFilter);
    registrar.register("never", () => {
        /* nothing */
    });
    registrar.register("empty", () => "");
    registrar.register("key", ({ key }: TagNode) => key);

    registrar.register(
        "stopIteration",
        ({ values }: TagNode, { filters }: Internals<T>) => {
            const endAtIteration = Number(values);
            const savedBase = filters.getOrDefault("base");

            filters.register(
                "base",
                (tag: TagNode, internals: Internals<T>) => {
                    return internals.iteration >= endAtIteration
                        ? tag.text ?? ""
                        : savedBase(tag, internals);
                },
            );

            return { ready: true };
        },
    );

    registrar.register("memorytest", (_tag, { memory }: Internals<T>) => {
        const memoryTestKey = "base:memorytest";
        return String(memory.fold(memoryTestKey, (v: number) => ++v, 0));
    });
};
