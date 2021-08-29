import type { FilterApi } from "./filterManager/filters";
import type { ManagerInfo } from "./filterManager/index";
import type {
    Filter as FilterType,
    WeakFilter as WeakFilterType,
} from "./filterManager/filters";
import type { RegistrarApi } from "./filterManager/registrar";
import type { DeferredEntry as DefEntry } from "./filterManager/deferred";
export type { DeferredOptions } from "./filterManager/deferred";

import type { TagNode } from "./template/nodes";
import type { TemplateInfo, IterationInfo, ResultInfo } from "./template";
import type { RoundInfo, DataOptions } from "./template/types";

export type Internals<P extends Record<string, unknown>> = ManagerInfo<
    TagNode,
    TemplateInfo,
    IterationInfo,
    RoundInfo,
    ResultInfo,
    DataOptions,
    P
> &
    TemplateInfo &
    IterationInfo &
    RoundInfo;
export type DeferredInternals<P extends Record<string, unknown>> = ManagerInfo<
    TagNode,
    TemplateInfo,
    IterationInfo,
    RoundInfo,
    ResultInfo,
    DataOptions,
    P
> &
    TemplateInfo &
    IterationInfo;
export type AftermathInternals<P extends Record<string, unknown>> = ManagerInfo<
    TagNode,
    TemplateInfo,
    IterationInfo,
    RoundInfo,
    ResultInfo,
    DataOptions,
    P
> &
    TemplateInfo;
export type DeferredEntry<P extends Record<string, unknown>> = DefEntry<
    DeferredInternals<P>
>;
export type AftermathEntry<P extends Record<string, unknown>> = DefEntry<
    AftermathInternals<P>
>;

export type Registrar<P extends Record<string, unknown>> = RegistrarApi<
    TagNode,
    Internals<P>,
    DataOptions
>;
export type Filters<P extends Record<string, unknown>> = FilterApi<
    TagNode,
    Internals<P>
>;
export type Filter<P extends Record<string, unknown>> = FilterType<
    TagNode,
    Internals<P>
>;
export type WeakFilter<P extends Record<string, unknown>> = WeakFilterType<
    TagNode,
    Internals<P>
>;
export type Recipe<T extends Record<string, unknown>> = (
    options?: Record<string, unknown>,
) => (filters: Registrar<T>) => void;
export type Eval<T extends Record<string, unknown>, U> = (
    t: TagNode,
    i: Internals<T>,
) => U;

export type {
    FilterResult,
    WeakFilterResult,
    FilterApi,
} from "./filterManager/filters";
export type { DeferredApi, Deferred } from "./filterManager/deferred";

export type { DataOptions } from "./template/types";
export type { TagNode } from "./template/nodes";
export type { Optic, WeakSeparator, WeakCircumfix } from "./template/optics";

export type { Stylizer } from "./stylizer";

export type Triple<T> = [T, T, T];

export interface WrapOptions {
    wrapId: string;
    getTagnames: (o: Record<string, unknown>) => string[];
    setTagnames: (
        o: Record<string, unknown>,
        newNames: string[],
    ) => Record<string, unknown>;
}

export type InactiveBehavior<T extends Record<string, unknown>> = (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => WeakFilter<T>;

export type InactiveAdapter<T extends Record<string, unknown>> = (
    behavior: InactiveBehavior<T>,
) => InactiveBehavior<T>;

export interface RecipeOptions {
    [key: string]: any;
}

export type Un = Record<string, unknown>;
