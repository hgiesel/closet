import type {
    Tag,
} from '../types'

export interface TagApi {
    getText(): string
    updateText(newText: string): void
    get(path: number[]): Tag
    exists(path: number[]): boolean
}
