interface DebugMode {
    closetDebug: boolean;
}

export const ankiLog = (...objs: unknown[]): boolean => {
    if (!(globalThis as typeof globalThis & DebugMode).closetDebug) {
        return false;
    }

    const logDiv = Object.assign(document.createElement("div"), {
        className: "closet-log",
        innerText: objs.map(String).join("\n"),
    });

    const qa = document.getElementById("qa");

    if (!qa) {
        return false;
    }

    qa.appendChild(logDiv);
    return true;
};
