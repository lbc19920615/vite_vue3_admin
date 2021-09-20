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

        // [
        //     {
        //         name: '单行文本',
        //         value: '',
        //         id: ZY.rid(),
        //         data: {
        //             tagName: 'el-input',
        //         },
        //         lib: 'input'
        //     },
        //     {
        //         name: '按钮',
        //         value: '',
        //         id: ZY.rid(),
        //         data: {
        //             tagName: 'el-button'
        //         },
        //         lib: 'input'
        //     },
        //     {
        //         name: '下拉',
        //         value: '',
        //         id: ZY.rid(),
        //         data: {
        //             tagName: 'el-select'
        //         },
        //         lib: 'input'
        //     },
        //     {
        //         name: '间距',
        //         value: '',
        //         id: ZY.rid(),
        //         data: {
        //             tagName: 'el-space'
        //         },
        //         lib: ''
        //     },
        // ]
    let htmlTags = generateHtmlTags()
    return htmlTags.concat(eleTags)
}