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
    if (eleDeps.length > 0) {
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


  // console.log(multiRoots)
  return str
  // console.log(eleDeps, multiRoots, linkFromPIDS, linkToPIDS, links)
}

function buildRootJsxLink(curContext, context) {
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
      innerText = innerText + buildRootJsxLink(toDepContextItem, context)
    }
  })

  let inners = []
  toDepContext.forEach(toDepContextItem => {
    inners.push(
      buildRootJsxLink(toDepContextItem, context)
    )
  })

  let innerStr = inners.join(',')

  // let attrStr = buildAttrs(rawData.attrs)
  // let afterAttrs = rawData.afterAttrs ?? ''
  // let beforeAttrs = rawData.beforeAttrs ?? ''

  let attrsObj = {}
  let style = ''
  if (Array.isArray(rawData.styles)) {
    rawData.styles.forEach((v) => {
      style = style + `${v[0]}:${v[1]};`
    })
  }


  if (Array.isArray(rawData.attrs)) {
    attrsObj =Object.fromEntries( rawData.attrs.map(v => {
      return [
        v.name,
        v.value
      ]
    }))
  }

  // console.log('rawData', rawData, style)
  if (style) {
    attrsObj.style = style
  }
  // if (attrsObj.style) {
  //   let style2 = attrsObj.style.split(';').map(v => {
  //     let a = v.split(':')
  //     return [
  //       a[0]?.trim(),
  //       a[1]?.trim()
  //     ]
  //   }).filter(v => {
  //     return typeof v[1] !== 'undefined'
  //   })
  //   attrsObj.style = Object.fromEntries(style2)
  // }
  let attrStr = ZY.JSON5.stringify(attrsObj)

  // console.log(attrsObj)
  let str = ''
  if (rawData.tagName) {
    // innerText = innerText.trim()
    // if (!innerText) {
    //   if (rawData.textContent) {
    //     innerText = rawData.textContent
    //   }
    // }
    // console.log(inners.length)
    if (inners.length > 0) {
      str = `h('${rawData.tagName}', ${attrStr}, [${innerStr}])`
    } else {
      str = `h('${rawData.tagName}', ${attrStr}, [${rawData.textContent ?? ''}])`
    }
    // str = `<${rawData.tagName} ${beforeAttrs} ${attrStr} ${afterAttrs}>${innerText}</${rawData.tagName}>`;
  } else {
    if (rawData.textContent) {
      innerText = rawData.textContent
    }
    str = innerText
  }
  curContext.str = str
  return str
}

export function buildJsx(data) {
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
    if (eleDeps.length > 0) {
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


  multiRoots.forEach((multiRoot) => {
    str = str + buildRootJsxLink(context[multiRoot.id], context)
  })

  return str
}

function buildRootDeepTreeLink(curContext, context) {
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
      innerText = innerText + buildRootDeepTreeLink(toDepContextItem, context)
    }
  })

  let inners = []
  toDepContext.forEach(toDepContextItem => {
    inners.push(
      buildRootDeepTreeLink(toDepContextItem, context)
    )
  })


  // let attrStr = buildAttrs(rawData.attrs)
  // let afterAttrs = rawData.afterAttrs ?? ''
  // let beforeAttrs = rawData.beforeAttrs ?? ''
  let JSON5 = ZY.JSON5
  let metasObj = {}



  if (Array.isArray(rawData.metas)) {
    metasObj =Object.fromEntries( rawData.metas.map(v => {
      return [
        v.name,
        v.value
      ]
    }))
  }


  let metaStr = JSON5.stringify(metasObj, null, 2)

  // console.log(rawData)
  let str = ''
  if (rawData.tagName) {
    if (inners.length > 0) {

      let innerStrs = []
      inners.forEach(function (inner) {
        // console.log(inner)
        try {
          let innerObj = JSON5.parse(inner)
          innerObj.z_parent = rawData.tagName
          innerStrs.push(JSON5.stringify(innerObj, null, 2))
        } catch (e) {
          console.log(e, inner)
          innerStrs.push(JSON5.stringify({}, null, 2))
        }
      })
      let innerStr = innerStrs.join(',\n');
      str = `{
  name: '${rawData.tagName}',
  children: [
${innerStr}
],
  meta: ${metaStr}
}`
    } else {
      // str = `h('${rawData.tagName}', ${attrStr}, [${rawData.textContent ?? ''}])`

      let loadComponentStr = `loadPage('${rawData.tagName}')`
      if (rawData.storeName) {
        loadComponentStr = `loadPage('${rawData.tagName}', '${rawData.storeName}')`
      }
      // console.log(Object.keys(rawData))
     let needStr = ''
      if (rawData.attro) {
        // ZY.lodash.each(rawData.attro, function (item, key) {
        //   needStr = needStr + `${key}: ${item},\n`
        // })
        needStr = ZY.JSON5.stringify(rawData.attro)
      }
      if (needStr) {
        needStr = needStr.slice(1)
        needStr = needStr.slice(0, needStr.length - 1)
        if (needStr) {

          needStr = needStr  + ','
        }
      }
      console.log(needStr)
      str = `
{
  name: '${rawData.tagName}',
  ${needStr}
  meta: ${metaStr},
  component: ['', "${loadComponentStr}"],
}
`
    }
    // str = `<${rawData.tagName} ${beforeAttrs} ${attrStr} ${afterAttrs}>${innerText}</${rawData.tagName}>`;
  } else {
    if (rawData.textContent) {
      innerText = rawData.textContent
    }
    str = innerText
  }
  curContext.str = str
  return str
}

export function commonBuildDeepTree(startFun) {
  return function (data) {
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
      if (eleDeps.length > 0) {
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


    multiRoots.forEach((multiRoot) => {
      str = str + startFun(context[multiRoot.id], context)
    })

    return str
  }
}

export let buildDeepTree = commonBuildDeepTree(
  buildRootDeepTreeLink
)
