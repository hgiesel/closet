// NOTE should be same as under ../anki/src/utils.py
export const versionInfo = [
    0 /* MAJOR */,
    5 /* MINOR */,
    0 /* PATCH */,
]

export const prereleaseInfo = [
]

export const version = versionInfo.join('.') + (prereleaseInfo.length > 0
    ? `-${prereleaseInfo.join('.')}`
    : '')
