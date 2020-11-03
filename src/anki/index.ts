import type { MemoryMap } from './persistence'
import type { FilterManager } from '..'
import type { Delimiters } from '../template/parser/tokenizer/delimiters'

import { interspliceChildNodes, BrowserTemplate, ChildNodeSpan, cleanup } from '../browser'
import { persistenceInterface } from './persistence'


type CardSide = 'front' | 'back'

interface AnkiBuiltins {
    MathJax: any
    _updatingQA: boolean
    closetImmediately: boolean
    onShownHook: Function[]
}

const getCardNumber = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

const preset = (cardType: string, tagsFull: string, side: CardSide) => ({
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
    closet: unknown,
    preset: unknown,
    chooseMemory: unknown,
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
export const init = <T extends Record<string, unknown>>(
    closet: unknown,
    logic: UserLogic<T>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
): number[] => {
    const userPreset = preset(cardType, tagsFull, side)
    const chooseMemory = persistenceInterface(side, document.getElementById('qa')?.innerHTML ?? '')

    return logic(closet, userPreset, chooseMemory)
        .map((value: SetupOutput<T>) => load(...value))
}

const logInit = <T extends Record<string, unknown>>(
    closet: any,
    logic: UserLogic<T>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
) => {
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

export const devLog = (text: string) => {
    document.getElementById('qa')?.appendChild(document.createTextNode(text))
}

const delayAction = (callback: () => void) => {
    // Only works on Desktop as far as I know
    const viaShownHook = () => (globalThis as typeof globalThis & AnkiBuiltins).onShownHook.push(callback)
    // Works when MathJax is available in globalThis, desktop, or mobile
    // const viaMathJaxQueue = () => (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.Queue(callback)

    if ((globalThis as typeof globalThis & AnkiBuiltins).closetImmediately) {
        /**
         * This is interesting, if you do not care for MathJax whatsoever
         */
        callback()
        devLog('Option 1')
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
                    devLog(`Option 2: ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}`)
                }
                catch (e) {
                    /**
                     * On mobile, as there is no onShownHook
                     */
                    // This break mobile atm
                    // viaMathJaxQueue()
                    callback()
                    devLog(`Option 3; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}; ${e}`)
                }
            }
            else {
                /**
                 * On desktop, or mobile, if MathJax finishes quickly
                 */
                // This break mobile atm
                // viaMathJaxQueue()
                callback()
                devLog(`Option 4; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue)}}`)
            }
        }
        catch (e) {
            /**
             * On web, as there is neither _updatingQA nor MathJax
             */
            callback()
            devLog(`Option 5; ${JSON.stringify((globalThis as typeof globalThis & AnkiBuiltins).MathJax)}; ${e}`)
        }
    }
}

export const initialize = <T extends Record<string, unknown>>(
    closet: any,
    logic: UserLogic<T>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
) => {
    delayAction(() => logInit(closet, logic, cardType, tagsFull, side))
}
