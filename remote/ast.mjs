import sast from 'scss-parser'
import fs from 'fs'
import parses from './parsers/index.mjs'

const fileContent = fs.readFileSync('./remote/s.scss').toString()

const ast = sast.parse(fileContent)
// console.dir(tree, {depth: null})

fs.writeFileSync('./remote/a.json', JSON.stringify(ast, null ,2))


import createQueryWrapper from 'query-ast'

let $ = createQueryWrapper(ast)

let context = new Map()

function buildContext( ) {
  let rootContext = {
    variables: new Map()
  }
  let declaration = $("declaration")
  let declarationLength = declaration.length()
  for (let i = 0; i < declarationLength; i++) {
    let variableName = declaration.eq(i).find('variable').value()
    let variableVal = declaration.eq(i).find('value').value()
    // console.log([variableName, variableVal])

    rootContext.variables.set(variableName, variableVal)
  }
  return rootContext
}
context.set('root', buildContext())

// console.log(context.get('root'))

function eachNodes(QueryWrap, callback) {
  let len = QueryWrap.length()
  for (let i = 0; i < len; i++) {
    callback(QueryWrap.eq(i), i)
  }
}

let actionStack = []

function buildATRule() {
  let s = $("atrule")

  for (let i = 0; i < s.length(); i++) {
    let atRule = s.eq(i)
    // console.log(atRule.find("string_double").value())

    let atRuleName = atRule.find("atkeyword").value()
    let atRuleSet = atRule.find("string_double")

    let atRuleValue = new Map()
    eachNodes(atRuleSet, function (item, key) {
      atRuleValue.set(key, item.value())
    })

    // console.log(atRuleValue)

    let ret = parses.use(atRuleName, atRuleValue)
    if (ret) {
      actionStack.push(ret)
    }
  }
}

buildATRule()

console.log(actionStack)
