import type { Un } from "./types"

import { MetaFilterManager } from "./filterManager/index";
import { FilterApi } from "./filterManager/filters";
import { Storage, StorageType } from "./filterManager/storage";
import { DeferredApi } from "./filterManager/deferred";
import { Status } from "./template/types";

import type { FilterResult } from "./filterManager/filters";
import type {
    TagRenderer,
    TemplateInfo,
    IterationInfo,
    ResultInfo,
} from "./template";
import type { TagNode } from "./template/nodes";
import type {
    TagAccessor,
    TagProcessor,
    RoundInfo,
    DataOptions,
    ProcessorOutput,
} from "./template/types";

const filterResultToProcessorOutput = (
    filterResult: FilterResult,
): ProcessorOutput => ({
    status: filterResult.parse
        ? filterResult.ready
            ? Status.ContinueTags
            : Status.ContainsTags
        : filterResult.ready
        ? Status.Ready
        : Status.NotReady,
    result: filterResult.result,
});

const fillDataOptions = (partial: Partial<DataOptions>): DataOptions => {
    const optics = partial.optics ?? [];

    return {
        inlineOptics: partial.inlineOptics ?? optics,
        blockOptics: partial.blockOptics ?? optics,
        capture: partial.capture ?? false,
    };
};

const closetEnvironmentName = "_closetEnvironment";
interface ClosetEnvironment {
    [closetEnvironmentName]: StorageType<unknown>;
}

export class FilterManager<P extends Un>
    extends MetaFilterManager<
        TagNode,
        TemplateInfo,
        IterationInfo,
        RoundInfo,
        ResultInfo,
        DataOptions,
        P
    >
    implements TagRenderer {
    static make<P extends Un>(
        preset: P = {} as P,
        memory: StorageType<unknown> = new Map(),
    ): FilterManager<P> {
        const environment = !Object.prototype.hasOwnProperty.call(
            globalThis,
            closetEnvironmentName,
        )
            ? ((globalThis as typeof globalThis & Partial<ClosetEnvironment>)[
                  closetEnvironmentName
              ] = new Map())
            : (globalThis as typeof globalThis & Partial<ClosetEnvironment>)[
                  closetEnvironmentName
              ];

        return new FilterManager(
            preset,
            new FilterApi() as any,
            new Storage(new Map()),
            new DeferredApi() as any,
            new DeferredApi() as any,
            new Storage(new Map()),
            new Storage(memory),
            new Storage(environment as StorageType<unknown>),
        );
    }

    makeAccessor(
        template: TemplateInfo,
        iteration: IterationInfo,
    ): TagAccessor {
        const accessor = this.filterAccessor(template, iteration);

        return (name: string): TagProcessor => {
            const processor = accessor.getProcessor(name);

            return {
                execute: (data: TagNode, round: RoundInfo): ProcessorOutput =>
                    filterResultToProcessorOutput(
                        processor.execute(
                            data,
                            super.getInternals(template, iteration, round),
                        ),
                    ),
                getOptions: () => fillDataOptions(processor.getOptions()),
            };
        };
    }

    finishIteration(template: TemplateInfo, iteration: IterationInfo) {
        this.executeDeferred(template, iteration);
    }

    finishRun(template: TemplateInfo, result: ResultInfo): void {
        this.executeAftermath(template, result);
        this.reset();
    }
}
