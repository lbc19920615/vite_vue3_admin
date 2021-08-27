

export function log(...args) {
    return console.log(...args)
    // return PubSub.publish.apply(PubSub, [SYSTEM_CONSOLE_LOG, ...args])
}


