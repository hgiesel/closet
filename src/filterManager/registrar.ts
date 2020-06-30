import { FilterApi, Readiable, WeakFilter } from './filters'
import { Storage } from './storage'

const defaultOptions = {}

export class RegistrarApi<T extends Readiable, D extends object> {
    private filters: FilterApi<T>
    private options: Storage<Partial<D>>

    constructor(filters: FilterApi<T>, options: Storage<Partial<D>>) {
        this.filters = filters
        this.options = options
    }

    register(name: string, filter: WeakFilter<T>, options: Partial<D> = defaultOptions): void {
        this.filters.register(name, filter)
        this.options.set(name, options)
    }

    getOptions(name: string): Partial<D> {
        return this.options.get(name, {})
    }
}
