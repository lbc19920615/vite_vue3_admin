import qs from 'qs'
import fetch from 'node-fetch'

async function fetchText(url = '') {
    try {
        let res = await fetch(url)
        if (res.ok) {
            return await res.text()
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

export default function myPlugin({
    virtualFileId,
    origin,
} = {}) {

    let config;

    return {
        name: 'my-plugin', // required, will show up in warnings and errors
        configResolved(resolvedConfig) {
            // store the resolved config
            config = resolvedConfig
        },
        resolveId(id) {
            // console.log('resolveId', id)
            if (id.startsWith(virtualFileId)) {
                // return virtualFileId
                return id
            }
        },
        async load(id) {
            // console.log(config)
            if (id.startsWith(virtualFileId)) {
                let parsed = id.split(':')
                // console.log('load', id, parsed[1])
                if (Array.isArray(parsed) && parsed[1]) {
                    let query = qs.parse(parsed[1])
                    console.log(parsed[1])
                    let content = await fetchText(origin + '?' + parsed[1])
                    return 'export default `'+content+'`'
                }
            }
        }
    }
}
