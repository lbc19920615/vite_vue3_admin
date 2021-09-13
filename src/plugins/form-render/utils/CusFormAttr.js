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
