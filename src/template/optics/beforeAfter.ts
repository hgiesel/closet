export interface BeforeAfter {
    before: string
    after: string
}

export type WeakBeforeAfter = Partial<BeforeAfter> | string

export const weakBeforeAfterToBeforeAfter = (ws: WeakBeforeAfter): BeforeAfter => typeof ws === 'string'
    ? {
        before: ws,
        after: ws,
    }
    : {
        before: ws.before ?? '',
        after: ws.after ?? '',
    }
