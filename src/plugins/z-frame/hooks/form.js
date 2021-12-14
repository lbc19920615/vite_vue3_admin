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

/**
 *
 * @param process
 * @param defaultVal
 * @param def
 * @param computed
 * @returns {{init: {args: {src: string}, def: {parts: [{def: {}, computed: {}, name: string, serviceTpl: {args: {src: string}, def: {}}, type: string}], constants: {}}}, defaultVal: {}, name}}
 */
export function baseConfig2(process,
                            {
                                defaultVal = {},
                                def = {},
                                computed = {},
                                partName = 'form2'
                            } = {}) {
    let obj = {
        name: process,
        defaultVal: defaultVal,
        init: {
            def: {
                constants: {},
                parts: [
                    {
                        type: "form",
                        name: partName,
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
    // console.log(model)
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
            computed: {},
            defaultVal: ZY.JSON5.parse( v.defaultVal),
        }
    });
    // console.log(tureParts)
    ret.parts = tureParts
    return ret
}

globalThis.zformHelper = {
    baseConfig,
    formsToDef
}
