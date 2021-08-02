import call from './call.mjs'

let parses = (function () {
    let plugins = {}

    let ret = {}

    ret.register = function (name, v) {
        plugins[name] = v
    }

    ret.use = function (name, val) {
        if (plugins[name]) {
            return plugins[name](val)
        }
    }

    return ret
})()
call.install(parses)

export default parses
