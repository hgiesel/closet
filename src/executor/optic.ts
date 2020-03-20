const identity = (x: unknown) => x

const dimap = (
    l: (x: unknown) => unknown,
    r: (y: unknown) => unknown,
    f: (z: unknown) => unknown,
) => (x: unknown) => r(f(l(x)))

const lmap = (l: (x: unknown) => unknown, f: (y: unknown) => unknown) => (x: unknown) => f(l(x))
const rmap = (r: (x: unknown) => unknown, f: (y: unknown) => unknown) => (x: unknown) => r(f(x))

const forgetDimap = (l, _r, f) => lmap(l, f)

var dictFunc = {
  dimap: dimap,
    // u.assert(arguments.length === 3, "dimap: there should be 3 arguments");
    // u.assert(u.isFunction(f), "dimap: f should be a function");
    // u.assert(u.isFunction(g), "dimap: g should be a function");
  first: (self) => (p) => [self(p[0]), p[1]],
    // u.assert(arguments.length === 1, "first: there should be 1 argument");
  right: (self) => (x) => [x[0], x[0] ? self(x[1]) : x[1]],
    // u.assert(arguments.length === 1, "right: there should be 1 argument");
  wander: (self) => (xs) => xs.map(self),
    // u.assert(arguments.length === 1, "wander: there should be 1 argument");
}

const dictForgetNone = {
  dimap: forgetDimap,
  first: (self) => (x) => self(x[0]),
    // u.assert(arguments.length === 1, "first: there should be 1 argument");
  wander: (self) => (xs) => xs.map(self),
    // u.assert(arguments.length === 1, "wander: there should be 1 argument");
}

const indexGetter = (i) => (s) => [s[i], s]

const ix = (i) => {
  // u.assert(u.isNumber(i), "idx: i should be a number");

  const getter = indexGetter(i)
  const setter = ([val, orig]) => {
    const copy = [...orig]
    copy[i] = val
    return copy
  }

  return {
    subkind: "affine",
    zoom: (dict, x0) => {
      const x1 = dict.first(x0)
      const x2 = dict.dimap(getter, setter, x1)
      return x2
    }
  }
}

const key = (k) => {
  const getter = indexGetter(k)
  const setter = ([val, orig]) => {
    const copy = Object.assign({}, orig)
    copy[k] = val
    return copy
  }

  return {
    subkind: "lens",
    zoom: (dict, x0) => {
      const x1 = dict.first(x0)
      const x2 = dict.dimap(getter, setter, x1)
      return x2
    }
  }
}

const traversed = () => ({
  subkind: "traversal",
  zoom: (dict, x) => dict.wander(x)
})

const get = (optics, value) => {
  const f = run(optics, dictForgetNone, identity)
  return f(value)
}

const tryGet = (optics, value) => {
  const f = run(optics, dictForgetNone, identity)
  return f(value)
}

const set = (optics, value, b) => {
  return over(optics, value, () => b)
}

const over = (optics, value, g) => {
  const f = run(optics, dictFunc, g)
  return f(value)
};


const run = (optics, dict, f) => {
  const [
    zooms,
    opticKind,
  ] = optics.reduce(([rev, k], optic) =>
    (rev.unshift(optic.zoom), [rev, opticSupremum(k, optic.subkind)]),
    [[], 'iso']
  )

  console.log(opticKind)

  for (const z of zooms) {
    f = z(dict, f);
  }

  return f
}

const path = [traversed(), key('c')]


const old = [{a: 1, b: 2}, {b: 3, c: 4}]

const newv = over(path, old, (x) => (x + 1))
