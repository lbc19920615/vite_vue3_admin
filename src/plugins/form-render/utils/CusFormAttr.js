export function parseFormAttrToObj(str) {
  let JSON5 = ZY.JSON5;
  let ret = {}
  if (str) {
    let obj = JSON5.parse(str)
    ZY.lodash.each(obj, function (item, key) {
      if (key === 'statusType') {
        ret[obj.statusType]="1"
      } else {
        ret[key] = item
      }
    })
  }
  return ret
}
