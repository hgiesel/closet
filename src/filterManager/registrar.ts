import { Filterable, FilterApi, Readiable, WeakFilter } from "./filters";
import { Storage } from "./storage";

export class RegistrarApi<
    F extends Filterable,
    T extends Readiable,
    D extends Record<string, unknown>
> {
    private filters: FilterApi<F, T>;
    private options: Storage<Partial<D>>;

    constructor(filters: FilterApi<F, T>, options: Storage<Partial<D>>) {
        this.filters = filters;
        this.options = options;
    }

    register(
        name: string,
        filter: WeakFilter<F, T>,
        options: Partial<D> = {},
    ): void {
        this.filters.register(name, filter);
        this.options.set(name, options);
    }

    getOptions(name: string): Partial<D> {
        return this.options.get(name, {});
    }
}
