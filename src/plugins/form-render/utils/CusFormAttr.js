let BooleanKeys = ['clearable', 'showWordLimit']
let ReflectKeys = ['statusType']

export function parseFormAttrToObj(str) {
  let JSON5 = ZY.JSON5;
  let ret = {}
  if (str) {
    let obj = JSON5.parse(str)
    ZY.lodash.each(obj, function (item, key) {
      // console.log('clearable', item, typeof item, key)
      let propName = ZY.lodash.kebabCase(key)
      if (ReflectKeys.includes(key)) {
        ret[obj.statusType]="1"
      }
      else if (BooleanKeys.includes(key)) {
        if (item) {
          ret[key] = key
        } else {

        }
      }
      else {
        ret[propName] = item
      }
    })
  }
  return ret
}


/**
 * 将array rules转换为attr string
 * @param rules
 * @returns {string}
 */
export function parseRulesArrToStr(rules = [{message: ''}]) {
// console.log(rules)
  let _ = ZY.lodash
  let JSON5 = ZY.JSON5
  let arr = JSON5.parse(JSON5.stringify(rules))

  let filtedArr = arr.map(v => {
    let obj = JSON5.parse(v.value)
    return _.pickBy(obj, function (item) {
      if (typeof item === 'string') {
        return item
      }
      return true
    })
  })

  console.log('parseRulesArrToStr', rules, filtedArr)

  return JSON5.stringify(filtedArr)
}