import { MetaFilterManager } from './filterManager'
import { FilterApi } from './filterManager/filters'
import { Storage, StorageType } from './filterManager/storage'
import { DeferredApi } from './filterManager/deferred'
import { Status } from './template/tags'

import type { ManagerInfo } from './filterManager'
import type { Filter as FilterType, WeakFilter as WeakFilterType, FilterResult } from './filterManager/filters'
import type { RegistrarApi } from './filterManager/registrar'
import type { DeferredEntry as DefEntry } from './filterManager/deferred'

import type { TagRenderer, TemplateInfo, IterationInfo, ResultInfo } from './template'
import type { TagNode, TagAccessor, TagProcessor, RoundInfo, DataOptions, ProcessorOutput } from './template/tags'

export type Internals<P extends object> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo & IterationInfo & RoundInfo
export type DeferredInternals<P extends object> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo & IterationInfo
export type AftermathInternals<P extends object> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo
export type DeferredEntry<P extends object> = DefEntry<DeferredInternals<P>>
export type AftermathEntry<P extends object> = DefEntry<AftermathInternals<P>>

export type Registrar<P extends object> = RegistrarApi<TagNode, Internals<P>, DataOptions>
export type Filters<P extends object> = FilterApi<TagNode, Internals<P>>
export type { DataOptions } from './template/tags'

export type Filter<P extends object> = FilterType<TagNode, Internals<P>>
export type WeakFilter<P extends object> = WeakFilterType<TagNode, Internals<P>>
export type { FilterResult, WeakFilterResult, FilterApi } from './filterManager/filters'

const filterResultToProcessorOutput = (filterResult: FilterResult): ProcessorOutput => {
    if (!filterResult.ready) {
        return {
            result: null,
            status: Status.NotReady,
        }
    }

    if (filterResult.containsTags) {
        return {
            result: filterResult.result,
            status: Status.ContainsTags,
        }
    }

    return {
        result: filterResult.result,
        status: Status.Ready,
    }
}

const fillDataOptions = (partial: Partial<DataOptions>): DataOptions => {
    return {
        separators: partial.separators ?? [],
        capture: partial.capture ?? false,
    }

}

const closetEnvironmentName = '_closetEnvironment'
interface ClosetEnvironment {
    [closetEnvironmentName]: StorageType<unknown>
}

export class FilterManager<P extends object> extends MetaFilterManager<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> implements TagRenderer {
    static make(preset: object = {}, memory: StorageType<unknown> = new Map()) {
        const environment = !globalThis.hasOwnProperty(closetEnvironmentName)
            ? (globalThis as typeof globalThis & Partial<ClosetEnvironment>)[closetEnvironmentName] = new Map()
            : (globalThis as typeof globalThis & Partial<ClosetEnvironment>)[closetEnvironmentName]

        return new FilterManager(
            preset,
            new FilterApi() as any,
            new Storage(new Map()),
            new DeferredApi() as any,
            new DeferredApi() as any,
            new Storage(new Map()),
            new Storage(memory),
            new Storage(environment as StorageType<unknown>),
        )
    }

    makeAccessor(template: TemplateInfo, iteration: IterationInfo): TagAccessor {
        const accessor = this.filterAccessor(template, iteration)

        return (name: string): TagProcessor => {
            const processor = accessor.getProcessor(name)

            return {
                execute: (data: TagNode, round: RoundInfo): ProcessorOutput => filterResultToProcessorOutput(processor.execute(data, super.getInternals(template, iteration, round))),
                getOptions: () => fillDataOptions(processor.getOptions()),
            }
        }
    }

    finishIteration(template: TemplateInfo, iteration: IterationInfo) {
        this.executeDeferred(template, iteration)
    }

    finishRun(template: TemplateInfo, result: ResultInfo): void {
        this.executeAftermath(template, result)
        this.reset()
    }
}
