import {buildDeepTree} from "@/plugins/z-frame/components/ZLayoutEditor/xml";

export function app_buildDeepTree(data) {
  if (data) {
    let obj = ZY.JSON5.parse(data)
    let str = buildDeepTree(obj.data)
    // console.log('buildXML', obj, str)
    return str
  }
  return ''
}

export function app_initRoutesFromJSON5(str) {
  let obj = ZY.JSON5.parse(str, function (k, v) {
    if (k === 'component') {
      return new Function(v[0], `return ${v[1]}`)
    }

    return v
  })
  return obj
}
