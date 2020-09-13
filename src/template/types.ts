import type { TagNode } from './nodes'
import type { Separator } from './separator'


export type TagPath = number[]

export enum Status {
    Ready,
    NotReady,
    ContainsTags,
    ContinueTags,
}

export interface ProcessorOutput {
    result: string | null
    status: Status
}

export interface DataOptions {
    separators: Array<string | Partial<Separator>>
    capture: boolean
    [k: string]: unknown
}

export interface RoundInfo {
    path: TagPath
    depth: number
    ready: boolean
    capture: boolean
}

export type TagAccessor = (name: string) => TagProcessor

export interface TagProcessor {
    execute: (data: TagNode, round: RoundInfo) => ProcessorOutput
    getOptions: () => DataOptions
}
