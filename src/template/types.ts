import type { ASTNode, TagNode } from "./nodes";
import type { Optic } from "./optics";

export type TagPath = number[];

export enum Status {
    Ready,
    NotReady,
    ContinueTags,
    // when ready == true; result needs parsing, iterate down the new structure
    ContainsTags,
    // when ready == false; result needs parsing, but continue in normal order
}

export interface ProcessorOutput {
    result: string | ASTNode[] | null;
    status: Status;
}

export interface DataOptions {
    optics?: Optic[];
    blockOptics: Optic[];
    inlineOptics: Optic[];
    capture: boolean;
    [k: string]: unknown;
}

export interface RoundInfo {
    path: TagPath;
    depth: number;
    ready: boolean;
    isCapture: boolean;
}

export type TagAccessor = (name: string) => TagProcessor;

export interface TagProcessor {
    execute: (data: TagNode, round: RoundInfo) => ProcessorOutput;
    getOptions: () => DataOptions;
}
