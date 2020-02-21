const arc = require('arcsecond')

const pr = arc.sequenceOf([
  arc.many(arc.str('a')).map(vs => vs.join('')),
  arc.decide(v => arc.regex(new RegExp(`^b{${v.length}}`))),
  arc.decide(v => arc.regex(new RegExp(`^c{${v.length}}`))),
  arc.endOfInput,
])

console.log(pr.run('aaabbbccc'))
