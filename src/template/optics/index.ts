import { run } from "./lib/consumers.js";
import { dictFunction } from "./lib/profunctors.js";

import { templated } from "./lib/templated.js";
import { stripped, strippedRegex } from "./lib/stripped.js";
import { mapped } from "./lib/mapped.js";
import { separated } from "./lib/separated.js";

///////

// const seps = ["::"].map(weakSeparatorToSeparator)
// const result = splitValues("foo::bla", seps)

// console.log(result)


///////

const zooms = [
    stripped({ before: '<br>', after: '<br>' }),
    templated({ before: '<li>', after: '</li>' }),
    mapped(),
    strippedRegex({ before: "\\d::", after: "" }),
    separated({ sep: "::", max: 2 }),
]

const f = run(zooms, dictFunction, (s: string): string => {
    console.log('test', s)
    return "fo"
})

const myInput = `<br>Before
<ul>
    <li>1::Element 1::bla</li>
    <li>0::Element 2</li>
    <li>2::Element 3</li>
</ul>
After
<br>`.trim()

const result2 = f(myInput)

console.log(result2)
