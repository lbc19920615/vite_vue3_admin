export function baseConfig({defaultVal = {}, def = {}, computed = {}} = {}) {
    let obj = {
        name: 'form-editor',
        defaultVal: defaultVal,
        init: {
            def: {
                constants: {},
                parts: [
                    {
                        type: "form",
                        name: "form2",
                        serviceTpl: {
                            def: {},
                            args: {
                                src: "bservice.twig"
                            }
                        },
                        def: def,
                        computed: computed
                    },
                ],
            },
            args: {
                src: 'comformscr2.twig'
            }
        }
    }
    return obj
}

export function formsToDef(model = {}) {
    let ret = model
    let tureParts  = model.parts.map(v => {
        return {
            type: v.type,
            name: v.name,
            serviceTpl: {
                def: {},
                args: {
                    src: "bservice.twig"
                }
            },
            def: ZY.JSON5.parse( v.properties),
            computed: {}
        }
    });
    // console.log(tureParts)
    ret.parts = tureParts
    return ret
}
