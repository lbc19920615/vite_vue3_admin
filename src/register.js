

if (!CustomVueComponent.defMap.has('JsonCodeEditor')) {
    import('@/components/CodeEditor/JsonCodeEditor.vue').then(res => {
        let def = res.default
        console.log('sdsdsdsds', def)
        CustomVueComponent.register(def,'JsonCodeEditor')
    })
}