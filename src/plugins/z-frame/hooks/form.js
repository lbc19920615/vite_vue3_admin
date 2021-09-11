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