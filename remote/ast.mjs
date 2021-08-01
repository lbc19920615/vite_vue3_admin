import sast from 'scss-parser'
import fs from 'fs'

const ast = sast.parse('root { @call sds "sdsd=1"; @all "sdsds"; }')
// console.dir(tree, {depth: null})

fs.writeFileSync('./remote/a.json', JSON.stringify(ast, null ,2))


import createQueryWrapper from 'query-ast'

let $ = createQueryWrapper(ast)

let s = $("atrule")

console.log(s.length())

for (let i = 0; i < s.length(); i++) {
  let atRule = s.eq(i)
  // console.log(atRule.find("string_double").value())

  let key = atRule.find("atkeyword").value()
  let value = atRule.find("string_double").value()
  console.log(key, value)
}
