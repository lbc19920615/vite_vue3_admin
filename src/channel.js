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

export const COMMAND = {
  RELOAD: 'BC:RELOAD'
}
