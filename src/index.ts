import { Status, ProcessorOutput } from './template/evaluate'

import { MetaFilterManager, ManagerInfo } from './filterManager'
import { Filter as FilterType, WeakFilter as WeakFilterType, FilterResult, FilterApi } from './filterManager/filters'

import { TagRenderer, TemplateInfo, IterationInfo } from './template'
import { TagAccessor, TagProcessor, RoundInfo, DataOptions } from './template/evaluate'
import { TagData } from './template/tags'

export type Internals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo & IterationInfo & RoundInfo
export type DeferredInternals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo & IterationInfo
export type AftermathInternals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo

export type Filters<P extends object> = FilterApi<Internals<P>, DataOptions>
export type { DataOptions } from './template/evaluate'

export type Filter<P extends object> = FilterType<Internals<P>, DataOptions>
export type WeakFilter<P extends object> = WeakFilterType<Internals<P>, DataOptions>
export type { FilterResult, WeakFilterResult } from './filterManager/filters'

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

export class FilterManager<P extends object> extends MetaFilterManager<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> implements TagRenderer {
    makeAccessor(template: TemplateInfo, iteration: IterationInfo): TagAccessor {
        const accessor = this.filterAccessor(template, iteration)

        return (name: string): TagProcessor => {
            const processor = accessor.getProcessor(name)
            const options = fillDataOptions(processor.options)

            return {
                execute: (data: TagData, round: RoundInfo): ProcessorOutput => {
                    return filterResultToProcessorOutput(processor.execute(data, round))
                },
                options: options,
            }
        }
    }

    finishIteration(template: TemplateInfo, iteration: IterationInfo) {
        this.executeDeferred(template, iteration)
    }

    finishRun(template: TemplateInfo): void {
        this.executeAftermath(template)
        this.reset()
    }
}
