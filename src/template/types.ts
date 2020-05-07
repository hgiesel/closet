import type {
    Tag,
} from '../templateTypes'

export interface TagsApi {
    getText(): string
    updateText(newText: string): void
    get(path: number[]): Tag
    exists(path: number[]): boolean
}
