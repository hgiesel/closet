import {
    choice,
    letter,
    str,
    possibly,
    many1,
    recursiveParser,
    whitespace,
    optionalWhitespace,
    between,
    sepBy,
    many,
    anythingExcept,
    char,
} from 'arcsecond'

enum TreeTypes {
    NodeType = 'node',
        LeafType = 'leaf',
}

interface TreeNode {
    kind: TreeTypes.NodeType
    nodes: Tree[]
}

interface TreeLeaf {
    kind: TreeTypes.LeafType
    value: string,
}

type Tree = TreeNode
    | TreeLeaf

const mkLeaf = (x: string): TreeLeaf => ({
    kind: TreeTypes.LeafType,
    value: x,
})

const mkTree = (xs: Tree[]): TreeNode => ({
    kind: TreeTypes.NodeType,
    nodes: xs,
})

const parseLeaf = many1(letter).map(x => mkLeaf(x.join('')))
const ws = (parser) => between(optionalWhitespace)(optionalWhitespace)(parser)

const doubleQuotes = between('"')('"')
const parseString = doubleQuotes(many(choice([
    str('\"'),
    anythingExcept('"'),
])))


export const parseItem = recursiveParser(() => (choice([
    // parseString,
    parseLeaf,
    parseNode,
])))

const parseBase = sepBy (whitespace) (parseItem)
    .map((xs: Tree[]) => mkTree(xs))

const parseNode = (between
    (str('('))
    (str(')'))
    (sepBy (whitespace) (parseItem))
).map((xs: Tree[]) => mkTree(xs))


//////////////////////////

const btn = document.querySelector('#btn-parse')

btn.addEventListener('click', (_e) => {
    const input: HTMLTextAreaElement | null = document.querySelector('#setlang-code')
    
    if (!input) {
        return void(0)
    }

    console.log(input.value)

    const output = parseBase.run(input.value)

    document
        .querySelector('#setlang-output')
        .innerHTML = JSON.stringify(output, null, 4)
})
