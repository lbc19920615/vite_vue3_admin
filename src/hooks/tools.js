export function inspectDOM(trueDom, type = 'rect') {
  let clone = document.createElement('div')
  let computedStyle = getComputedStyle(trueDom)
  // console.log(computedStyle.marginBottom)
  let marginBottom = parseFloat(computedStyle.marginBottom)
  let marginTop = parseFloat(computedStyle.marginTop)
  let client = trueDom.getBoundingClientRect()
  // console.log(clone, client)
  clone.setAttribute('data-type', type)
  clone.style.position = 'fixed'
  clone.style.left = client.left + 'px'
  // clone.style.top = (client.top - marginBottom) + 'px'
  clone.style.width = client.width + 'px'
  if (type === 'line') {
    clone.style.top = ( client.top + client.height + marginBottom) + 'px'
    clone.style.height = 1 + 'px'
  }
  else if (type === 'rect') {
    clone.style.top = (client.top - marginBottom) + 'px'
    clone.style.height = (client.height + marginTop + marginBottom + 1) + 'px'
  }
  clone.setAttribute('current-to-move', type)
  return clone
}

export function createDebugTool(id = 'debug') {
  return {
    refresh(clone) {
      let tool = document.getElementById(id)
      tool.innerHTML = ''
      if (clone) {
        tool.appendChild(clone)
      }
    }
  }
}
