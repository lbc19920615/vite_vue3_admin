import qs from 'qs'

export default function myPlugin() {
    const virtualFileId = '@my-virtual-file'

    return {
        name: 'my-plugin', // required, will show up in warnings and errors
        resolveId(id) {
            // console.log('resolveId', id)
            if (id.startsWith(virtualFileId)) {
                // return virtualFileId
                return id
            }
        },
        load(id) {
            if (id.startsWith(virtualFileId)) {
                let parsed = id.split(':')
                // console.log('load', id, parsed[1])
                if (Array.isArray(parsed) && parsed[1]) {
                    let query = qs.parse(parsed[1])
                    console.log(query)
                    return `export const msg = "from virtual file"`
                }
            }
            // if (id === virtualFileId) {
            //     return `export const msg = "from virtual file"`
            // }
        }
    }
}
