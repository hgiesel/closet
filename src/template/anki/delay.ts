import { ankiLog } from "./utils";

interface AnkiBuiltins {
    MathJax: any;
    _updatingQA: boolean;
    closetImmediately: boolean;
    onShownHook: Array<() => void>;
}

enum InitDescription {
    ClosetImmediately = 1,
    DesktopShownHook,
    MobileMathJax,
    DesktopMobileLate,
    Web,
}

const stringifyDescription = (description: InitDescription): string => {
    switch (description) {
        case InitDescription.ClosetImmediately:
            return "You have set the variable globalThis.closetImmediately.";
        case InitDescription.DesktopShownHook:
            return (
                "Closet executes while MathJax is still rendering. " +
                "You are on AnkiDesktop. " +
                "The action will be pushed onto onShownHook."
            );
        case InitDescription.MobileMathJax:
            return (
                "Closet executes while MathJax is still rendering. " +
                "You are on AnkiMobile. " +
                "The action will be enqueued on MathJax.Hub.Queue."
            );
        case InitDescription.DesktopMobileLate:
            return (
                "Closet executes after MathJax finished rendering. " +
                "The action will be executed immediatley."
            );
        case InitDescription.Web:
            return (
                "You are on AnkiWeb, which does not have MathJax. " +
                "Alternatively, you are on platform with MathJax 3. " +
                "The action will be executed immediatley."
            );
        default:
            return "No Description found. " + "This should never happen.";
    }
};

type InitMode = (cb: () => void) => void;

const initModes: Record<string, InitMode> = {
    raw: (callback) => callback(),
    // Only works on Desktop as far as I know
    viaShownHook: (callback) =>
        (globalThis as typeof globalThis & AnkiBuiltins).onShownHook.push(
            callback,
        ),
    // Works when MathJax is available in globalThis, desktop, or mobile
    viaMathJaxQueue: (callback) =>
        (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.Queue(
            callback,
        ),
};

const getMathJaxQueue = (): Record<string, any> => {
    return (globalThis as typeof globalThis & AnkiBuiltins).MathJax.Hub.queue;
};

const getMathJaxQueueForPrinting = (): Record<string, any> => {
    const mathJaxQueue = getMathJaxQueue();
    const mathJaxPrintable = Object.assign({}, mathJaxQueue);
    mathJaxPrintable.queue = mathJaxPrintable.queue.map(String);

    return mathJaxPrintable;
};

const delayChoice = (): [InitMode, InitDescription, unknown[]] => {
    if ((globalThis as typeof globalThis & AnkiBuiltins).closetImmediately) {
        /**
         * This is interesting, if you do not care for MathJax whatsoever
         */
        return [initModes.raw, InitDescription.ClosetImmediately, []];
    } else {
        try {
            /**
             * This check is important for Desktop
             * Pushing to shownHook only makes sense, if it has not been cleared yet
             * After the clearing _updatingQA is set to false
             * Additionally _updatingQA exists on Mobile, however not shown hook
             */

            const mathJaxIsCurrentlyExecuting = (globalThis as typeof globalThis &
                AnkiBuiltins)._updatingQA;
            const mathJaxQueue = getMathJaxQueueForPrinting();

            if (mathJaxIsCurrentlyExecuting) {
                const maybeOnShownHook = (globalThis as typeof globalThis &
                    AnkiBuiltins).onShownHook;

                if (maybeOnShownHook) {
                    /**
                     * On desktop, if MathJax takes long
                     */
                    return [
                        initModes.viaShownHook,
                        InitDescription.DesktopShownHook,
                        [
                            JSON.stringify(maybeOnShownHook.map(String)),
                            JSON.stringify(mathJaxQueue),
                        ],
                    ];
                } else {
                    /**
                     * On mobile, as there is no onShownHook
                     */
                    return [
                        initModes.viaMathJaxQueue,
                        InitDescription.MobileMathJax,
                        [JSON.stringify(mathJaxQueue)],
                    ];
                }
            } else {
                /**
                 * On desktop, or mobile, if MathJax finishes quickly
                 */
                return [
                    initModes.raw,
                    InitDescription.DesktopMobileLate,
                    [JSON.stringify(mathJaxQueue)],
                ];
            }
        } catch (error) {
            /**
             * On web, as there is neither _updatingQA nor MathJax
             * Or on a platform with MathJax 3, as MathJax does not have queue property
             */
            return [initModes.raw, InitDescription.Web, [error]];
        }
    }
};

export const delayAction = (callback: () => void): void => {
    const [choice, description, logs] = delayChoice();

    ankiLog(
        `Init mode ${description}`,
        stringifyDescription(description),
        ...logs,
    );

    choice(callback);
};
