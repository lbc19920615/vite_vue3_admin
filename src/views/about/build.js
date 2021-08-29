function buildPart({type, name, ui, properties}) {
    return  {
        type,
        name,
        serviceTpl: {
            def: {},
            args: {
                src: 'bservice.twig',
            },
        },
        def: {
            type: 'object',
            ui,
            properties
        },
        computed: {
        },
    }
}

/**
 * contentTpl
 * @param parts [{ui, properties}]
 * @returns {*}
 */
export let buildFormDepContent = function (parts = []) {
    let JSON5 = ZY.JSON5;
    let parsedParts = []
    let defaultVals = {}
    parts.forEach(part => {
        if (part.name && part.type) {
            try {
                let ui = JSON5.parse(part.ui)
                let properties = JSON5.parse(part.properties)
                let obj = {
                    type: part.type,
                    name: part.name,
                    serviceTpl: {
                        def: {},
                        args: {
                            src: 'bservice.twig',
                        },
                    },
                    def: {
                        type: 'object',
                        ui,
                        properties,
                    },
                    computed: {
                    },
                }
                defaultVals[obj.name] = JSON5.parse(part.defaultVal)
                parsedParts.push(obj)
            } catch (e) {
                console.log(e)
            }
        }
    })
    console.log(parsedParts)
    let obj = {
        name: 'process-step1',
        defaultVal: defaultVals,
        init: {
            def: {
                constants: {},
                parts: parsedParts
            },
            args: {
                src: 'comformscr.twig'
            }
        }
    }
    // console.log(obj)
    return JSON5.stringify(obj)
}