import { MetaFilterManager } from './filterManager'
import { FilterApi } from './filterManager/filters'
import { Storage, StorageType } from './filterManager/storage'
import { DeferredApi } from './filterManager/deferred'
import { Status } from './template/types'

import type { ManagerInfo } from './filterManager'
import type { Filter as FilterType, WeakFilter as WeakFilterType, FilterResult } from './filterManager/filters'
import type { RegistrarApi } from './filterManager/registrar'
import type { DeferredEntry as DefEntry } from './filterManager/deferred'

import type { TagRenderer, TemplateInfo, IterationInfo, ResultInfo } from './template'
import type { TagNode } from './template/nodes'
import type { TagAccessor, TagProcessor, RoundInfo, DataOptions, ProcessorOutput } from './template/types'

export type Internals<P extends Record<string, unknown>> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo & IterationInfo & RoundInfo
export type DeferredInternals<P extends Record<string, unknown>> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo & IterationInfo
export type AftermathInternals<P extends Record<string, unknown>> = ManagerInfo<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> & TemplateInfo
export type DeferredEntry<P extends Record<string, unknown>> = DefEntry<DeferredInternals<P>>
export type AftermathEntry<P extends Record<string, unknown>> = DefEntry<AftermathInternals<P>>

export type Registrar<P extends Record<string, unknown>> = RegistrarApi<TagNode, Internals<P>, DataOptions>
export type Filters<P extends Record<string, unknown>> = FilterApi<TagNode, Internals<P>>
export type { DataOptions } from './template/types'

export type Filter<P extends Record<string, unknown>> = FilterType<TagNode, Internals<P>>
export type WeakFilter<P extends Record<string, unknown>> = WeakFilterType<TagNode, Internals<P>>
export type { FilterResult, WeakFilterResult, FilterApi } from './filterManager/filters'

const filterResultToProcessorOutput = (filterResult: FilterResult): ProcessorOutput => filterResult.ready
    ? {
        status: filterResult.containsTags
            ? Status.ContainsTags
            : Status.Ready,
        result: filterResult.result,
    }
    : {
        status: Status.NotReady,
        result: null,
    }

const fillDataOptions = (partial: Partial<DataOptions>): DataOptions => ({
    separators: partial.separators ?? [],
    capture: partial.capture ?? false,
})

const closetEnvironmentName = '_closetEnvironment'
interface ClosetEnvironment {
    [closetEnvironmentName]: StorageType<unknown>
}

export class FilterManager<P extends Record<string, unknown>> extends MetaFilterManager<TagNode, TemplateInfo, IterationInfo, RoundInfo, ResultInfo, DataOptions, P> implements TagRenderer {
    static make(preset: Record<string, unknown> = {}, memory: StorageType<unknown> = new Map()) {
        const environment = !Object.prototype.hasOwnProperty.call(globalThis, closetEnvironmentName)
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
