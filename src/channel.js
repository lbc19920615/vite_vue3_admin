const port1 = new BroadcastChannel('internal_notification');
const port2 = new BroadcastChannel('internal_notification');

let events = new Map()

export function setMessageHandler (eventName, cb = () => {}) {
  events.set(eventName, cb)
}

port2.onmessage = function (e) {
  // console.log('sdsdsdsdsdsdsdsdsd')
  events.forEach(event => {
    if (event) {
      event(e)
    }
  })
}

export function sendChannelMessage(str = '') {
  return port1.postMessage(str)
}

export function sendJSON5ChannelMessage(obj = {}) {
  return port1.postMessage(ZY.JSON5.stringify(obj))
}

export function setCommandHandler(COMMAND_TYPE, onCallback, eventName = ZY.rid()) {
  setMessageHandler(eventName, function (e) {
    let data = e.data ?? ''
    if (data) {
      let obj = ZY.JSON5.parse(data)
      // console.log('obj', obj)
      if (obj.type && obj.type === COMMAND_TYPE) {
        if (onCallback) {
          onCallback(obj.e)
        }
      }
    }
  })
}

export const COMMAND = {
  RELOAD: 'BC:RELOAD',
  INSPECT: 'BC:INSPECT',
}
