const debugRecipe = (filterApi) => {

    const pathFilter = ({path}) => path.join(':')
    filterApi.register('tagpath', pathFilter)

    const testFilter = ({}, {tag}) => {
        console.log(tag.get([0]))
        return ''
    }

    filterApi.register('test', testFilter)
}

export default debugRecipe
