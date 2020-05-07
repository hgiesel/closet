const tags = '{{Tags}}'
const tagList = '{{Tags}}'.split(' ')
const cardType = '{{Card}}'


export const isSuffix = (suffix: any[], vec: any[]): boolean => {
    let result = true

    if (suffix.members.length > vec.members.length) {
        result = false
    }

    for (let i = 0; i < suffix.members.length; i++) {
        result = (result &&
            vec.members[vec.members.length - (i + 1)] === suffix.members[suffix.members.length - (i + 1)])
    }

    return result
}
