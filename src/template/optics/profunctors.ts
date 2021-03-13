// Heavily inspired by:
// - https://oleg.fi/gists/posts/2017-04-18-glassery.html#instances-forget
// - Optika JS library

enum ProfunctorInstance {
    Strong,
    Choice,
    Traversing,
    Bicontravariant,
}

export interface ProfunctorDict {
    classes: ProfunctorInstance[];
    dimap: <A, B, C, D>(
        l: (a: A) => B,
        r: (c: C) => D,
        f: (b: B) => C,
    ) => (a: A) => unknown;

    first: <A, B, C>(f: (a: A) => B) => ([a, c]: [A, C]) => unknown;

    right: <A, B, C>(
        f: (a: A) => B,
    ) => ([isRight, x]: [false, C] | [true, A]) => unknown;
}

/////////////////////////////////////// Profunctor (->)
const dimap = <A, B, C, D>(
    l: (a: A) => B,
    r: (c: C) => D,
    f: (b: B) => C,
): ((a: A) => D) => (a: A): D => r(f(l(a)));

// Strong profunctor
// (a, b) == [a, b]
const first = <A, B, C>(f: (a: A) => B) => ([a, c]: [A, C]): [B, C] => [
    f(a),
    c,
];

// Choice profunctor
// Either l r == [boolean, L | R] == [false, L] | [true | R]
const right = <A, B, C>(f: (a: A) => B) => ([isRight, x]:
    | [false, C]
    | [true, A]): [false, C] | [true, B] =>
    isRight
        ? ([isRight, f(x as A)] as [true, B])
        : ([isRight, x] as [false, C]);

export const dictFunction: ProfunctorDict = {
    classes: [
        ProfunctorInstance.Choice,
        ProfunctorInstance.Strong,
        ProfunctorInstance.Traversing,
    ],
    dimap,
    first,
    right: right as any,
};

/////////////////////////////////////// Profunctor (Forget r) ==  Star (Const r)
const lmap = <A, B, C>(l: (a: A) => B, f: (b: B) => C): ((a: A) => C) => (
    a: A,
): C => f(l(a));

const dimapForget = <A, B, C, D>(
    l: (a: A) => B,
    _r: (c: C) => D,
    f: (b: B) => C,
): ((a: A) => C) => lmap(l, f);

const firstForget = <A, B, C>(f: (a: A) => B) => ([a]: [A, C]): B => f(a);

const rightForget = <A, B, C>(f: (a: A) => B) => ([isRight, x]:
    | [false, C]
    | [true, A]): [] | B =>
    isRight
        ? (f(x as A) as B)
        : [
              /* mempty */
          ];

export const dictForget: ProfunctorDict = {
    classes: [
        ProfunctorInstance.Bicontravariant,
        ProfunctorInstance.Choice,
        ProfunctorInstance.Strong,
        ProfunctorInstance.Traversing,
    ],
    dimap: dimapForget,
    first: firstForget,
    right: rightForget as any,
};
