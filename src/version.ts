// NOTE should be same as under ../anki/src/utils.py
export const versionInfo = [
    0 /* MAJOR */,
    1 /* MINOR */,
    1 /* PATCH */,
]

export const prereleaseInfo = [
    'beta',
    /* '1', */
]

export const version = `v${versionInfo.join('.')}` + (prereleaseInfo.length > 0
    ? `-${prereleaseInfo.join('.')}`
    : '')
