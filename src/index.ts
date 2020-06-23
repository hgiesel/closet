import { Status, ProcessorOutput } from './template/evaluate'

import { MetaFilterManager, ManagerInfo } from './filterManager'
import { Filter as FilterType, WeakFilter as WeakFilterType, FilterResult, FilterApi } from './filterManager/filters'

import { TagRenderer, TemplateInfo, IterationInfo } from './template'
import { TagProcessor, RoundInfo } from './template/evaluate'
import { TagData, DataOptions } from './template/tags'

export type Internals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo & IterationInfo & RoundInfo
export type DeferredInternals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo & IterationInfo
export type AftermathInternals<P extends object> = ManagerInfo<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> & TemplateInfo

export type Filters<P extends object> = FilterApi<Internals<P>, DataOptions>
export type { DataOptions } from './template/tags'

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

export class FilterManager<P extends object> extends MetaFilterManager<TemplateInfo, IterationInfo, RoundInfo, DataOptions, P> implements TagRenderer {
    makeProcessor(template: TemplateInfo, iteration: IterationInfo): TagProcessor {
        return (data: TagData, round: RoundInfo): ProcessorOutput => {
            return filterResultToProcessorOutput(this.filterProcessor(template, iteration)(data, round))
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
