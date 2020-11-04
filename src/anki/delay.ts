import { ankiLog } from './utils'

interface AnkiBuiltins {
    MathJax: any
    _updatingQA: boolean
    closetImmediately: boolean
    onShownHook: Array<() => void>
}

enum InitMode {
    Raw,
    ViaShownHook,
    ViaMathJaxQueue,
}

const delayChoice = (): [number, InitMode, unknown[]] => {
    if ((globalThis as typeof globalThis & AnkiBuiltins).closetImmediately) {
        /**
         * This is interesting, if you do not care for MathJax whatsoever
         */
        return [
            1,
            InitMode.Raw,
            [],
        ]
    }
    else {
        try {
            /**
             * This check is important for Desktop
             * Pushing to shownHook only makes sense, if it has not been cleared yet
             * After the clearing _updatingQA is set to false
             * Additionally _updatingQA exists on Mobile, to suit a different purpose
             */
            const mathJaxQueue = (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue

            if ((globalThis as typeof globalThis & AnkiBuiltins)._updatingQA) {
                const maybeOnShownHook = (globalThis as typeof globalThis & AnkiBuiltins).onShownHook

                if (maybeOnShownHook) {
                    /**
                     * On desktop, if MathJax takes long
                     */
                    return [
                        2,
                        InitMode.ViaShownHook, [
                            JSON.stringify(maybeOnShownHook),
                            JSON.stringify(mathJaxQueue),
                        ],
                    ]
                }
                else {
                    /**
                     * On mobile, as there is no onShownHook
                     * TODO should be mathjax queue, but breaks mobile
                     */
                    return [
                        3,
                        InitMode.Raw, [
                            JSON.stringify(mathJaxQueue),
                        ],
                    ]
                }
            }
            else {
                /**
                 * On desktop, or mobile, if MathJax finishes quickly
                 * TODO This break mobile atm, used to use viaMathJaxQueue())
                 */
                return [
                    4,
                    InitMode.Raw, [
                        JSON.stringify(mathJaxQueue),
                    ],
                ]
            }
        }
        catch (error) {
            /**
             * On web, as there is neither _updatingQA nor MathJax
             */
            return [
                5,
                InitMode.Raw, [
                    error,
                ],
            ]
        }
    }
}

export const delayAction = (callback: () => void): void => {
    // Only works on Desktop as far as I know
    const viaShownHook = () => (globalThis as typeof globalThis & AnkiBuiltins).onShownHook.push(callback)
    // Works when MathJax is available in globalThis, desktop, or mobile
    const viaMathJaxQueue = () => (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.Queue(callback)

    let [
        no,
        choice,
        logs
    ] = delayChoice()

    ankiLog(`Init option ${no}`, ...logs)

    switch (choice) {
        case InitMode.Raw:
            callback()
            break

        case InitMode.ViaShownHook:
            viaShownHook()
            break

        case InitMode.ViaMathJaxQueue:
            viaMathJaxQueue()
            break

        default:
            callback()
            break
    }
}
