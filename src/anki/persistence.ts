// This code is based on
// https://github.com/SimonLammer/anki-persistence
//
// changes:
// - rewrite to TS
// - drop support for _default key

export interface AnkiPersistence {
    clear: () => void
        getItem(key: string): unknown
    getItem(): unknown
    setItem(key: string, value: unknown): void
        setItem(value: unknown): void
        removeItem(key: string): void
        removeItem(): void
        isAvailable(): boolean
}

type JSON =
    | null
    | boolean
    | number
    | string
    | JSON[]
    | { [prop: string]: JSON }

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

    const _persistenceKey = 'github.com/hgiesel/closet'

    // used in android, iOS, web
    const Persistence_sessionStorage = function() {
        let isAvailable = false
        try {
            if (typeof(globalThis.sessionStorage) === 'object') {
                isAvailable = true
                this.clear = function() {
                    for (var i = 0; i < sessionStorage.length; i++) {
                        var k = sessionStorage.key(i)
                        if (k.indexOf(_persistenceKey) == 0) {
                            sessionStorage.removeItem(k)
                            i--
                        }
                    }
                }

                this.setItem = function(key: string, value: JSON) {
                    sessionStorage.setItem(_persistenceKey + key, JSON.stringify(value))
                }

                this.getItem = function(key: string) {
                    return JSON.parse(sessionStorage.getItem(_persistenceKey + key))
                }

                this.removeItem = function(key: string) {
                    sessionStorage.removeItem(_persistenceKey + key)
                }
            }
        } catch(err) {}

        this.isAvailable = function() {
            return isAvailable
        }
    }

    // used in windows, linux, mac
    const Persistence_windowKey = function(persistentKey: string) {
        const obj = globalThis[persistentKey]
        let isAvailable = false

        if (typeof(obj) === 'object') {
            isAvailable = true

            this.clear = function() {
                obj[_persistenceKey] = {}
            }

            this.setItem = function(key: string, value: JSON) {
                obj[_persistenceKey][key] = value
            }

            this.getItem = function(key: string) {
                return obj[_persistenceKey][key] == undefined
                    ? null
                    : obj[_persistenceKey][key]
            }

            this.removeItem = function(key: string) {
                delete obj[_persistenceKey][key]
            }

            if (obj[_persistenceKey] == undefined) {
                this.clear()
            }
        }

        this.isAvailable = function() {
            return isAvailable
        }
    }
    // android, iOS, web
    const persistence = new Persistence_sessionStorage()

    if (!persistence.isAvailable()) {
        // windows, mac (2.0)
        globalThis.Persistence = new Persistence_windowKey("py")
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
            globalThis.Persistence = new Persistence_windowKey("qt")
        }
    }

    return persistence
}

export const persistence = initPersistence()
