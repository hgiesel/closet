# NOTE should be same as under ../../src/version.ts
versionInfo = [
    0, # MAJOR
    2, # MINOR
    5, # PATCH
]

prereleaseInfo = [
]

version = 'v' + '.'.join([str(comp) for comp in versionInfo]) + (
    f'-{".".join([str(comp) for comp in prereleaseInfo])}' if len(prereleaseInfo) > 0 else ''
)
