import PubSub from 'pubsub-js'
import {SYSTEM_CONSOLE_LOG} from "./event-types";

export function log(...args) {
    return PubSub.publish.apply(PubSub, [SYSTEM_CONSOLE_LOG, ...args])
}

export function setupLoggerHandler() {
    PubSub.subscribe(SYSTEM_CONSOLE_LOG, function (msg, ...args) {
        console.log(...args)
    })
}
