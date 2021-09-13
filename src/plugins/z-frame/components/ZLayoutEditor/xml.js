import {toRaw} from "vue";

function buildAttrs(arr = []) {
  let str = ''
  arr.forEach((item) => {
    str = str + `${item.name}='${item.value}'`
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
  let attrStr = buildAttrs(rawData.attrs)
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
  let str = ''
  if (rawData.tagName) {
    innerText = innerText.trim()
    if (!innerText) {
      if (rawData.textContent) {
        innerText = rawData.textContent
      }
    }
    str = `<${rawData.tagName} ${attrStr}>${innerText}</${rawData.tagName}>`;
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
  eleDeps.forEach((eleDep) => {
    let id = eleDep.id
    if (linkFromPIDS.includes(id) && !linkToPIDS.includes(id)) {
      multiRoots.push(eleDep)
      context[id] = {
        str: '',
        id: eleDep.id,
        append: {
          eleDeps,
          linkToPIDS,
          linkFroms,
          links,
          linkFromPIDS
        }
      }
    }
  })

  let str = ''
  multiRoots.forEach((multiRoot) => {
    str = str + buildRootXmlLink(context[multiRoot.id], context)
  })


  // console.log(str)
  return str
  // console.log(eleDeps, multiRoots, linkFromPIDS, linkToPIDS, links)
}
