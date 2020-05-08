const debugRecipe = (filterApi) => {

    const pathFilter = (
        {path},
    ) => {
        return path.join(':')
    }


    const testFilter = ({}, {tags}) => {
        return tags.get([0])
    }

    filterApi.register('tagpath', pathFilter)
    filterApi.register('test', testFilter)
}

export default debugRecipe
