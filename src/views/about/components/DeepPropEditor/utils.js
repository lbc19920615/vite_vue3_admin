export function getDeepConfigFromLinksAndDeps(links, deps) {
  let rootId = ''
  const JSON_PARSE_KEYS = ['widgetConfig', 'rules']

  function findItemLinkedDep(item) {
    let dep
    let link = links.find(v => v.from === item.id)
    if (link) {
      dep = deps.find(v => v.id === link.toPID)
    }
    return dep
  }

  // console.log('onGetData', deps, links)
  let deepObj = {}
  let cur;

  let setObj = ZY.lodash.set
  let JSON5 = ZY.JSON5

  function deepTransform(target, obj, path) {

    for (let [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        //
      } else {
        // 当value是object类型 递归查找
        if (typeof value === 'object') {
          deepTransform(target, value, `${path}['${key}']`)
        } else {
          // 只有特殊key才被翻译
          if (JSON_PARSE_KEYS.includes(key)) {
            // context.obj[key] = JSON5.parse(value)
            // setObj(target, path, JSON5.parse(value))
            // console.log(key, path)
            let parent = ZY.lodash.get(target, path)
            if (path === '') {
              parent = target
            }
            // console.log(parent, key, value)
            try {
              parent[key] = JSON5.parse(value)
            } catch (e) {
              parent[key] = {}
            }
          }
        }
      }
    }
  }

  function parseEditorData(dataStr) {
    try {
      let obj = JSON5.parse(dataStr)
      deepTransform(
        obj,
        obj,
        ''
      )
      // console.log(obj)
      return obj
    } catch (e) {
      return {}
    }
  }

  function handleDeep(curDep = {}, path) {
    if (curDep.type === 'array') {
      // console.log('array')
      setObj(deepObj, path, {
        type: 'array',
        items: {}
      })

      let newPath = `${path}['items']`

      // console.log(deepObj)
      // 因为array是特殊的object 只有items一个属性
      let item = curDep.items[0]
      let dep = findItemLinkedDep(item)
      if (dep) {
        handleDeep(dep, newPath)
      }
    } else if (curDep.type === 'object') {
      setObj(deepObj, path,
        {
          type: 'object',
          properties: {},
        }
      )

      for (let item of curDep.items) {
        let parsedData = {}
        parsedData = parseEditorData(item.data)
        let newPath = `${path}['properties']['${item.key}']`

        // deepPoint.properties[item.key] = parsedData

        // console.log(path, parsedData)

        setObj(deepObj, newPath,
          parsedData
        )

        // 找寻当前item是否有绑定的下一个dep
        let dep = findItemLinkedDep(item)

        // console.log(item, dep, deepObj, newPath)
        if (dep) {
          handleDeep(dep, newPath)
        }
      }
    } else {
      console.log('not array and object', curDep)
    }
  }

  if (Array.isArray(links) && links.length > 0) {
    let linkFirst = links[0]
    if (linkFirst && linkFirst.fromPID) {
      rootId = linkFirst.fromPID
    }
    cur = deps.find(v => v.id === rootId)
  } else {
    if (Array.isArray(deps)) {
      rootId = deps[0].id
      cur = deps[0]
    }
  }
  // console.log(rootId, deepObj)
  if (rootId) {
    handleDeep(cur, 'root')
    return deepObj.root
  }
  return {}
}

export function buildDeepConfigData(merge = {}) {
  let obj = {type: 'string', ui: {type: '', label: '', widget: '', widgetConfig: '{}'}, rules: '{}'}
  let ret = ZY.lodash.merge(obj, merge)
  console.log('ret', ret)
  return ret
}
