import {
    parseProg
} from './recursive'

export const getProg = (code: string) => {
    const result = parseProg.run(code)
    return result.isError
        ? result
        : result.result
}
