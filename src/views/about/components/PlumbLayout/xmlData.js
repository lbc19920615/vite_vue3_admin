/**
 * 生成PlumbLayout  侧边栏格式的数据
 */

/**
 * 初始化html tags
 * @returns {[{data: {tagName: string}, lib: string, name: string, id: *, value: string},{data: {tagName: string}, lib: string, name: string, id: *, value: string}]}
 */
function generateHtmlTags() {
//    h1 - h6
    let tags = [
        {
            name: '自定义',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'div'
            },
            lib: ''
        },
        {
            name: 'template',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'template'
            },
            lib: ''
        },
    ]
    for (let i = 1; i < 6; i++) {
        tags.push(
            {
                name: 'h' + i,
                value: '',
                id: ZY.rid(),
                data: {
                    tagName: 'h' + i
                },
                lib: 'html'
            },
        )
    }
    return tags
}

/**
 * 获取miniapp PlumbLayout 侧边栏data
 * @returns {({data: {tagName: string}, lib: string, name: string, id: *, value: string}|{data: {tagName: string}, lib: string, name: string, id: *, value: string})[]}
 */
export function getMiniAppXmlData() {
    let eleTags = []
    let htmlTags = generateHtmlTags()
    return htmlTags.concat(eleTags)
}

/**
 * 获取 web PlumbLayout 侧边栏data
 * @returns {({data: {tagName: string}, lib: string, name: string, id: *, value: string}|{data: {tagName: string}, lib: string, name: string, id: *, value: string})[]}
 */
export function getXmlData() {
    let app = getApp()
    let elementTags = app.getElementComponentTags()
    let eleTags = elementTags.map(elementTag => {
        return {
            name: elementTag,
            value: '',
            id: ZY.rid(),
            data: {
                tagName: elementTag,
            },
            lib: 'element'
        }
    })
    let htmlTags = generateHtmlTags()
    return htmlTags.concat(eleTags)
}
