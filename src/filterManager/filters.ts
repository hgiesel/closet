import type { ASTNode } from "../template/nodes";

type ResultType = string | ASTNode[];

export interface FilterResult {
    ready: boolean;
    result: ResultType;
    parse: boolean;
}

export interface Filterable {
    toReprString(): string;
}

export type Filter<F, T> = (t: F, i: T) => FilterResult;

export type WeakFilterResult = Partial<FilterResult> | string | void;
export type WeakFilter<F, T> = (tag: F, internals: T) => WeakFilterResult;

const wrapWithBool = (result: ResultType, bool: boolean): FilterResult => ({
    ready: bool,
    result: result,
    parse: false,
});

const wrapWithReady = (result: ResultType): FilterResult =>
    wrapWithBool(result, true);
const wrapWithReadyBubbled = (
    result: ResultType,
    ready: boolean,
): FilterResult => wrapWithBool(result, ready);

const defaultFilter = <T extends Readiable>(t: Filterable, i: T) =>
    wrapWithReadyBubbled(t.toReprString(), i.ready);

const nullFilterResult: FilterResult = {
    ready: false,
    result: [],
    parse: false,
};

const standardizeFilterResult = (weak: WeakFilterResult): FilterResult => {
    switch (typeof weak) {
        case "string":
            return wrapWithReady(weak);

        case "object":
            // includes null
            return {
                ready: weak.ready ?? true,
                result: weak.result ?? [],
                parse: weak.parse ?? false,
            };

        default:
            // undefined
            // marks as not ready
            return nullFilterResult;
    }
};

export interface Readiable {
    ready: boolean;
}

export class FilterApi<
    F extends Filterable,
    T extends Readiable /* Internals with dependency on RoundInfo */
> {
    private filters: Map<string, WeakFilter<F, T>> = new Map();

    register(name: string, filter: WeakFilter<F, T>): void {
        this.filters.set(name, filter);
    }

    has(name: string): boolean {
        return this.filters.has(name);
    }

    get(name: string): WeakFilter<F, T> | null {
        return this.filters.get(name) ?? null;
    }

    getOrDefault(name: string): WeakFilter<F, T> {
        return this.get(name) ?? defaultFilter;
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name);
    }

    clearFilters(): void {
        this.filters.clear();
    }

    execute(name: string, data: F, internals: T): FilterResult {
        const filter = this.getOrDefault(name);
        return standardizeFilterResult(filter(data, internals));
    }
}
