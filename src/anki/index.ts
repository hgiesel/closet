import type { MemoryMap } from './persistence'
import type { FilterManager } from '..'
import type { Delimiters } from '../template/parser/tokenizer/delimiters'

import { interspliceChildNodes, BrowserTemplate, ChildNodeSpan, cleanup } from '../browser'
import { persistenceInterface } from './persistence'
import { ankiLog } from './utils'


type CardSide = 'front' | 'back'

interface AnkiBuiltins {
    MathJax: any
    _updatingQA: boolean
    closetImmediately: boolean
    onShownHook: Array<() => void>
}

const getCardNumber = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

interface DefaultPreset {
    card: string
    cardNumber: number
    tagsFull: string
    tags: string[]
    side: CardSide
    [key: string]: unknown
}

const preset = (cardType: string, tagsFull: string, side: CardSide): DefaultPreset => ({
    card: cardType,
    cardNumber: getCardNumber(cardType),
    tagsFull: tagsFull,
    tags: tagsFull.length === 0
        ? []
        : tagsFull.split(' '),
    side: side,
})


export const getQaChildNodes = (): ChildNodeSpan[] | null => {
    if (!window.document) {
        return null
    }

    const qa = window.document.getElementById('qa')

    if (!qa) {
        return null
    }

    return interspliceChildNodes(qa, {
        type: 'predicate',
        value: (v: any) => (
            v.tagName !== 'STYLE' &&
            v.tagName !== 'SCRIPT' &&
            v.id !== 'anki-am' /* Asset Manager support */
        )
    })
}

interface SetupOptions {
    delimiters: Delimiters,
}

type SetupOutput<T extends Record<string, unknown>> = [
    Element[],
    MemoryMap,
    FilterManager<T>,
    SetupOptions?,
]

type UserLogic<T extends Record<string, unknown>> = (
    closet: NodeModule,
    preset: T,
    chooseMemory: (memoryKey: string) => MemoryMap,
) => SetupOutput<T>[]

const load = <T extends Record<string, unknown>>(
    elements: Element[],
    memoryMap: MemoryMap,
    filterManager: FilterManager<T>,
    options?: SetupOptions,
): number => {
    const before = window.performance.now()
    BrowserTemplate
        .makeFromNodes(elements, options?.delimiters)
        .renderToNodes(filterManager)

    memoryMap.writeBack()
    const after = window.performance.now()

    return after - before
}

// Export for legacy support
export const init = (
    closet: NodeModule,
    logic: UserLogic<DefaultPreset>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
): number[] => {
    const userPreset = preset(cardType, tagsFull, side)
    const chooseMemory = persistenceInterface(side, document.getElementById('qa')?.innerHTML ?? '')

    return logic(closet, userPreset, chooseMemory)
        .map((value: SetupOutput<DefaultPreset>) => load(...value))
}

const logInit = (
    closet: NodeModule,
    logic: UserLogic<DefaultPreset>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
): void => {
    try {
        const times = init(closet, logic, cardType, tagsFull, side)
        console.info(`Closet executed in ${times.map((t: number) => t.toFixed(3))}ms.`)
    }
    catch (error) {
        console.error('An error occured while executing Closet:', error)
    }
    finally {
        cleanup()
    }
}

const delayAction = (callback: () => void): void => {
    // Only works on Desktop as far as I know
    const viaShownHook = () => (globalThis as typeof globalThis & AnkiBuiltins).onShownHook.push(callback)
    // Works when MathJax is available in globalThis, desktop, or mobile
    // const viaMathJaxQueue = () => (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.Queue(callback)

    if ((globalThis as typeof globalThis & AnkiBuiltins).closetImmediately) {
        /**
         * This is interesting, if you do not care for MathJax whatsoever
         */
        callback()
        ankiLog('Option 1')
    }
    else {
        try {
            /**
             * This check is important for Desktop
             * Pushing to shownHook only makes sense, if it has not been cleared yet
             * After the clearing _updatingQA is set to false
             * Additionally _updatingQA exists on Mobile, to suit a different purpose
             */
            if ((globalThis as typeof globalThis & AnkiBuiltins)._updatingQA) {
                try {
                    /**
                     * On desktop, if MathJax takes long
                     */
                    viaShownHook()
                    ankiLog(`Option 2: ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}`)
                }
                catch (e) {
                    /**
                     * On mobile, as there is no onShownHook
                     */
                    // This break mobile atm
                    // viaMathJaxQueue()
                    callback()
                    ankiLog(`Option 3; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}; ${e}`)
                }
            }
            else {
                /**
                 * On desktop, or mobile, if MathJax finishes quickly
                 */
                // This break mobile atm
                // viaMathJaxQueue()
                callback()
                ankiLog(`Option 4; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}`)
            }
        }
        catch (e) {
            /**
             * On web, as there is neither _updatingQA nor MathJax
             */
            callback()
            ankiLog(`Option 5; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax)}; ${e}`)
        }
    }
}

export const initialize = (
    closet: NodeModule,
    logic: UserLogic<DefaultPreset>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
): NodeModule => {
    delayAction(() => logInit(closet, logic, cardType, tagsFull, side))
    return closet
}
