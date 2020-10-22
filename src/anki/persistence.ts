// This code is based on
// https://github.com/SimonLammer/anki-persistence
//
// changes:
// - rewrite to TS
// - drop support for _default key

export type JSON =
    | null
    | boolean
    | number
    | string
    | JSON[]
    | { [prop: string]: JSON }

export interface AnkiPersistence {
    clear: () => void
    getItem(key: string): JSON
    setItem(key: string, value: JSON): void
    removeItem(key: string): void
    isAvailable(): boolean
}


const _persistenceKey = 'github.com/hgiesel/closet'

// used in android, iOS, web
class Persistence_sessionStorage implements AnkiPersistence {
    _isAvailable = false

    constructor() {
        try {
            if (typeof(globalThis.sessionStorage) === 'object') {
                this._isAvailable = true
            }
        }
        catch {
            // sessionStorage is disabled inside of 'data:' URLs
        }
    }

    clear() {
        for (var i = 0; i < sessionStorage.length; i++) {
            var k = sessionStorage.key(i)

            if (k && k.indexOf(_persistenceKey) === 0) {
                sessionStorage.removeItem(k as string)
                i--
            }
        }
    }

    setItem(key: string, value: JSON) {
        sessionStorage.setItem(_persistenceKey + key, JSON.stringify(value))
    }

    getItem(key: string): JSON {
        const item = sessionStorage.getItem(_persistenceKey + key) ?? 'null'
        return JSON.parse(item)
    }

    removeItem(key: string) {
        sessionStorage.removeItem(_persistenceKey + key)
    }

    isAvailable() {
        return this._isAvailable
    }
}

// used in windows, linux, mac
class Persistence_windowKey implements AnkiPersistence {
    _isAvailable = false
    obj: Record<string, any>

    constructor(persistentKey: string) {
        this.obj = (globalThis as any)[persistentKey]

        if (typeof(this.obj) !== 'object') {
            return
        }

        this._isAvailable = true

        if (this.obj[_persistenceKey] === undefined) {
            this.clear()
        }
    }

    clear() {
        this.obj[_persistenceKey] = {}
    }

    setItem(key: string, value: JSON) {
        this.obj[_persistenceKey][key] = value
    }

    getItem(key: string) {
        return this.obj[_persistenceKey][key] == undefined
            ? null
            : this.obj[_persistenceKey][key]
    }

    removeItem(key: string) {
        delete this.obj[_persistenceKey][key]
    }

    isAvailable() {
        return this._isAvailable
    }
}

const initPersistence = (): AnkiPersistence => {
    /**
     *   client  | sessionStorage | persistentKey | useful location |
     * ----------|----------------|---------------|-----------------|
     * web       |       YES      |       -       |       NO        |
     * windows   |       NO       |       py      |       NO        |
     * android   |       YES      |       -       |       NO        |
     * linux 2.0 |       NO       |       qt      |       YES       |
     * linux 2.1 |       NO       |       qt      |       YES       |
     * mac 2.0   |       NO       |       py      |       NO        |
     * mac 2.1   |       NO       |       qt      |       YES       |
     * iOS       |       YES      |       -       |       NO        |
     */


    // android, iOS, web
    let persistence = new Persistence_sessionStorage()

    if (!persistence.isAvailable()) {
        // windows, mac (2.0)
        persistence = new Persistence_windowKey("py")
    }

    if (!persistence.isAvailable()) {
        // if titleStartIndex > 0, window.location is useful
        const titleStartIndex = globalThis.location.toString().indexOf('title')
        const titleContentIndex = globalThis.location.toString().indexOf('main', titleStartIndex)

        if (
            titleStartIndex > 0 &&
            titleContentIndex > 0 &&
            (titleContentIndex - titleStartIndex) < 10
        ) {
            // linux, mac (2.1)
            persistence = new Persistence_windowKey("qt")
        }
    }

    return persistence
}

export const persistence = initPersistence()
