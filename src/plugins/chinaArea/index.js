export async function initChinaAreaManangerFromUrl(url = '') {
    let obj = {}
    let manager = {}
    let res = await fetch(url)
    if (res.ok) {
        obj = await res.json()
    }
    manager.obj = obj
    manager.get = function (path, defaultVal) {
        return ZY.lodash.get(obj, path, defaultVal)
    }
    return manager
}