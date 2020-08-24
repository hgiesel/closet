import type { TagNode } from './tags'
import type { Separator } from './separator'


export type TagPath = number[]

export enum Status {
    Ready,
    NotReady,
    ContainsTags,
}

export interface ProcessorOutput {
    result: string | null
    status: Status
}

export interface DataOptions {
    separators: Array<string | Partial<Separator>>
    capture: boolean
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
