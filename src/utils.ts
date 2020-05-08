export const TAG_START = '[['
export const TAG_END = ']]'

export const ARG_SEP = '::'
export const ALT_SEP = '||'

export const splitValues = (valuesRaw: string | null): string[][] =>
    valuesRaw === null
        ? []
        : valuesRaw.split(ARG_SEP).map(arg => arg.split('||'))
