function generateHtmlTags() {
//    h1 - h6
    let tags = []
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

export function getXmlData() {
    let eleTags = [
        {
            name: '单行文本',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'el-input',
            },
            lib: 'input'
        },
        {
            name: '按钮',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'el-button'
            },
            lib: 'input'
        },
        {
            name: '下拉',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'el-select'
            },
            lib: 'input'
        },
        {
            name: '间距',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'el-space'
            },
            lib: ''
        },
        {
            name: '自定义',
            value: '',
            id: ZY.rid(),
            data: {
                tagName: 'div'
            },
            lib: ''
        },
    ]
    let htmlTags = generateHtmlTags()
    return htmlTags.concat(eleTags)
}