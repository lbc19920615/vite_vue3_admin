import {toRaw} from "vue";

export function buildAttr(key, value) {
  return ` ${key}='${value ?? ''}'`
}

export function buildObjAttrs(obj = {}) {
  let str = ''
  // arr.forEach((item) => {
  //   if (item.name) {
  //     str = str + `${item.name}='${item.value ?? ''}'`
  //   }
  // })
  ZY.lodash.each(obj, (item, key) => {
    if (key) {
      str = str + buildAttr(key, item)
    }
  })
  return str
}

export function buildAttrs(arr = []) {
  let str = ''
  arr.forEach((item) => {
    if (item.name) {
      str = str + buildAttr(item.name, item.value)
    }
  })
  return str
}

function buildRootXmlLink(curContext, context) {
  let {append, id} = curContext
  let {linkFroms,links, eleDeps} = append
  let ele = eleDeps.find(v => v.id === id)
  // console.log('id', id, ele)
  let {data, items} = ele
  let rawData = toRaw(data)

  let rawItems = toRaw(items)
  let toDepContext = []
  rawItems.forEach(rawItem => {
    let rawItemId = rawItem.id
    if (linkFroms.includes(rawItemId)) {
      let link = links.find(link => link.from === rawItemId)
      let toDepID = link.toPID

      let c  = {
        str: '',
        id: toDepID,
        append: append
      }
      // console.log(toDepID, eleDep)
      context[toDepID] = c
      toDepContext.push(c)
    }
  })
  // console.log(toDepContext)

  let innerText = ''
  toDepContext.forEach(toDepContextItem => {
    if (toDepContextItem) {
      innerText = innerText + buildRootXmlLink(toDepContextItem, context)
    }
  })


  let attrStr = buildAttrs(rawData.attrs)
  let afterAttrs = rawData.afterAttrs ?? ''
  let beforeAttrs = rawData.beforeAttrs ?? ''
  // console.log('rawData', rawData)

  let str = ''
  if (rawData.tagName) {
    innerText = innerText.trim()
    if (!innerText) {
      if (rawData.textContent) {
        innerText = rawData.textContent
      }
    }
    str = `<${rawData.tagName} ${beforeAttrs} ${attrStr} ${afterAttrs}>${innerText}</${rawData.tagName}>`;
  } else {
    if (rawData.textContent) {
      innerText = rawData.textContent
    }
    str = innerText
  }
  curContext.str = str
  return str
}

export function buildXml(data) {
  let context = {}
  let { deps, links } = data
  // console.log(deps, links)
  let eleDeps  = []
  eleDeps = deps.filter(dep => dep.type === 'ele')
  let multiRoots = []
  let linkFromPIDS = links.map((item) => item.fromPID)
  let linkToPIDS = links.map((item) => item.toPID)
  let linkFroms = links.map((item) => item.from)
  let append = {
    eleDeps,
    linkToPIDS,
    linkFroms,
    links,
    linkFromPIDS
  }
  if (linkToPIDS.length === 0 && linkFromPIDS.length === 0) {
    if (eleDeps.length === 1) {
      multiRoots.push(eleDeps[0])
      let eleDep = eleDeps[0]
      let id = eleDep.id
      context[id] = {
        str: '',
        id: eleDep.id,
        append
      }
    }
  }
  else {
    eleDeps.forEach((eleDep) => {
      let id = eleDep.id

      if (linkFromPIDS.includes(id) && !linkToPIDS.includes(id)) {
        multiRoots.push(eleDep)
        context[id] = {
          str: '',
          id: eleDep.id,
          append
        }
      }

    })
  }

  let str = ''

// if (multiRoots.length < 1 && Array.isArray(deps) && deps.length  === 1) {
//   multiRoots = deps
// }

  multiRoots.forEach((multiRoot) => {
    str = str + buildRootXmlLink(context[multiRoot.id], context)
  })


  console.log(multiRoots)
  return str
  // console.log(eleDeps, multiRoots, linkFromPIDS, linkToPIDS, links)
}
