export enum SlangTypes {
    Prog = 'prog',
    Expr = 'expr',
    Symbol = 'symbol',
    String = 'string',
}

export interface SlangProg {
    kind: SlangTypes.Prog
    nodes: Slang[]
}

export interface SlangExpr {
    kind: SlangTypes.Expr
    head: Slang,
    tail: Slang[],
}

export interface SlangSymbol {
    kind: SlangTypes.Symbol
    value: string,
}

export interface SlangString {
    kind: SlangTypes.String
    value: string,
}

export type Slang = SlangExpr
           | SlangSymbol
           | SlangString


export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    nodes: xs,
})

export const mkExpr = (head: Slang, tail: Slang[]): SlangExpr => ({
    kind: SlangTypes.Expr,
    head: head,
    tail: tail,
})

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const mkString = (x: string): SlangString => ({
    kind: SlangTypes.String,
    value: x,
})
