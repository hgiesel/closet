/////////////////// Profunctor (->)
const dimap = <A,B,C,D>(
    l: (a: A) => B,
    r: (c: C) => D,
    f: (b: B) => C,
): (a: A) => D => (
    a: A,
): D => r(f(l(a)))

// const lmap = <A,B,C>(
//     l: (a: A) => B,
//     f: (b: B) => C,
// ): (a: A) => C => (
//     a: A,
// ): C => f(l(a))

// Strong profunctor
// (a, b) == [a, b]
const first = <A,B,C>(
    f: (a: A) => B,
) => (
    [a, c]: [A, C],
): [B, C] => [f(a), c]

// Choice profunctor
// Either l r == [boolean, L | R] == [false, L] | [true | R]
const right = <A,B,C>(
    f: (a: A) => B,
) => (
    [isRight, x]: [false, C] | [true, A],
): [false, C] | [true, B] => isRight
    ? [isRight, f(x as A)] as [true, B]
    : [isRight, x] as [false, C]

export const dictFunction: ProfunctorDict = {
    dimap,
    first,
    right: right as any /* TS typecheck issue */,
}

/////////////////// Profunctor Forget

// const forgetDimap = <A,B,C,D>(
//     l: (a: A) => B,
//     _r: (c: C) => D,
//     f: (b: B) => C,
// ): (a: A) => C => lmap(l, f)


// const dictForget = {
//     dimap: forgetDimap,
//     first: (f) => (x) => f(x[0]),
//     //  basically fmap @Maybe
//     right: (f) => (x) => x[0] ? f(x[1]) : x[1],

//     pre: (inner) => (f) => (xs) => [xs.map(x => inner.pre(f)(x)[0])],
//     post: (inner) => (f) => (xs) => xs.map(x => inner.post(f)([x]))[0],
// }

export interface ProfunctorDict {
    dimap: <A,B,C,D>(
        l: (a: A) => B,
        r: (c: C) => D,
        f: (b: B) => C,
    ) => (a: A) => D;

    first: <A,B,C>(
        f: (a: A) => B,
    ) => (
        [a, c]: [A, C],
    ) => [B, C];

    right: <A,B,C>(
        f: (a: A) => B,
    ) => (
        [isRight, x]: [false, C] | [true, A],
    ) => [false, C] | [true, B];
}
