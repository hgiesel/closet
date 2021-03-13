import { ankiLog } from "./utils";

// This code is based on
// https://github.com/SimonLammer/anki-persistence
//
// changes:
// - rewrite to TS
// - drop support for _default key

interface AnkiPersistence {
    clear: () => void;
    getItem(key: string): JSON;
    setItem(key: string, value: JSON): void;
    removeItem(key: string): void;
    isAvailable(): boolean;
}

type JSON =
    | null
    | boolean
    | number
    | string
    | JSON[]
    | { [prop: string]: JSON };

interface ClosetSideHash {
    closetCardHash: number;
}

export interface MemoryMap {
    key: string;
    map: Map<string, unknown>;
    writeBack: () => void;
}

const _persistenceKey = "github.com/hgiesel/closet";

// used in android, iOS, web
class Persistence_sessionStorage implements AnkiPersistence {
    _isAvailable = false;

    constructor() {
        try {
            if (typeof globalThis.sessionStorage === "object") {
                this._isAvailable = true;
            }
        } catch {
            // sessionStorage is disabled inside of 'data:' URLs
        }
    }

    clear() {
        for (let i = 0; i < sessionStorage.length; i++) {
            const k = sessionStorage.key(i);

            if (k && k.indexOf(_persistenceKey) === 0) {
                sessionStorage.removeItem(k as string);
                i--;
            }
        }
    }

    setItem(key: string, value: JSON) {
        sessionStorage.setItem(_persistenceKey + key, JSON.stringify(value));
    }

    getItem(key: string): JSON {
        const item = sessionStorage.getItem(_persistenceKey + key) ?? "null";
        return JSON.parse(item);
    }

    removeItem(key: string) {
        sessionStorage.removeItem(_persistenceKey + key);
    }

    isAvailable() {
        return this._isAvailable;
    }
}

// used in windows, linux, mac
class Persistence_windowKey implements AnkiPersistence {
    _isAvailable = false;
    obj: Record<string, any>;

    constructor(persistentKey: string) {
        this.obj = (globalThis as any)[persistentKey];

        if (typeof this.obj !== "object") {
            return;
        }

        this._isAvailable = true;

        if (this.obj[_persistenceKey] === undefined) {
            this.clear();
        }
    }

    clear() {
        this.obj[_persistenceKey] = {};
    }

    setItem(key: string, value: JSON) {
        this.obj[_persistenceKey][key] = value;
    }

    getItem(key: string) {
        return this.obj[_persistenceKey][key] == undefined
            ? null
            : this.obj[_persistenceKey][key];
    }

    removeItem(key: string) {
        delete this.obj[_persistenceKey][key];
    }

    isAvailable() {
        return this._isAvailable;
    }
}

const initPersistence = (): AnkiPersistence => {
    let persistence;
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
    persistence = new Persistence_sessionStorage();
    if (persistence.isAvailable()) {
        ankiLog("Used Persistence sessionStorage implementation");
        return persistence;
    }

    // windows, mac (2.0)
    persistence = new Persistence_windowKey("py");
    if (persistence.isAvailable()) {
        ankiLog("Used Persistence windowKey py implementation");
        return persistence;
    }

    // if titleStartIndex > 0, window.location is useful
    const titleStartIndex = location.toString().indexOf("title");
    const titleContentIndex = location
        .toString()
        .indexOf("main", titleStartIndex);

    if (
        titleStartIndex > 0 &&
        titleContentIndex > 0 &&
        titleContentIndex - titleStartIndex < 10
    ) {
        // linux, mac (2.1)
        ankiLog("Used Persistence windowKey qt implementation");
        return new Persistence_windowKey("qt");
    }

    ankiLog("Defaulted to Persistence windowKey implementation");
    return persistence;
};

const hashCode = (plain: string): number => {
    let hash = 0,
        i,
        chr;
    for (i = 0; i < plain.length; i++) {
        chr = plain.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const persistence = initPersistence();

export const persistenceInterface = (side: "front" | "back", label: string) => (
    memoryKey: string,
): MemoryMap => {
    /**
     * @param label: should identify the context where persistence is used
     */

    const currentHash =
        (globalThis as typeof globalThis & Partial<ClosetSideHash>)
            .closetCardHash ?? null;

    const getPersistentMap = (): Map<string, unknown> => {
        if (!persistence.isAvailable()) {
            // Persistence is not available, fallback to no memory
            return new Map();
        }

        if (side === "front") {
            const hash = hashCode(label);

            if (hash !== currentHash) {
                // This is a new displayed card, reset memory
                (globalThis as typeof globalThis &
                    Partial<ClosetSideHash>).closetCardHash = hash;
                return new Map();
            }
        }

        const maybeMap = persistence.getItem(memoryKey) as Iterable<
            readonly [string, unknown]
        >;
        return new Map(maybeMap);
    };

    const map = getPersistentMap();

    const setPersistentMap = (): void => {
        if (persistence.isAvailable()) {
            const persistentData = Array.from(map.entries());

            persistence.setItem(memoryKey, persistentData as JSON);
        }
    };

    const memoryMap = {
        key: memoryKey,
        map: map,
        writeBack: setPersistentMap,
    };

    return memoryMap;
};
