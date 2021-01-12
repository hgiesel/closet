// NOTE should be same as under ../anki/src/utils.py
export const versionInfo = [
    0 /* MAJOR */,
    3 /* MINOR */,
    1 /* PATCH */,
]

export const prereleaseInfo = [
]

export const version = `v${versionInfo.join('.')}` + (prereleaseInfo.length > 0
    ? `-${prereleaseInfo.join('.')}`
    : '')
