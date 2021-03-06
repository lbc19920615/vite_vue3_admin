import {reactive, watch, inject, getCurrentInstance, nextTick} from "vue";

export let PROPS_DEF =function () {
    return  {
        modelValue: null,
        ui: {
            type: Object,
            default() {
                return {}
            }
        },
        props: {
            type: Object,
            default() {
                return {}
            }
        },
        path_arr: {
          type: Array,
            default() {
                return []
            }
        },
        defs: {
            type: Object,
            default() {
                return {}
            }
        },
        prop_config: {
            type: Object,
            default() {
                return {}
            }
        },
        rules: null,
        // context 是一个com
        context: null,
        config: {
            type: Object,
            default() {
                return {}
            }
        },
        form_slot_content: null,
        field_uuid: String,
    }
}

export let CustomRenderControlMixin = {
    props: PROPS_DEF(),

    emits: [
        'valuechange'
    ],
    inject: ['curFormCon'],
    data() {
      return {
          // curFormCon: null,
          inited: false,
          // parentModelPath: '',
      }
    },
    mounted() {
        // this.curFormCon = inject('curFormCon')
        // console.log(this.curFormCon)
        this.inited = true
        if (this.lifeTimes && this.lifeTimes.onReady) {
            this.lifeTimes.onReady()
        }
        // console.log(this.comManager)
        // console.log('this.props', this.rules)
    },
    methods: {
        getWidgetConfig(name, defaultVal) {

            let v =  ZY.lodash.get(this, 'ui.widgetConfig.' + name, defaultVal)

            let hasDom = document.querySelector(v)
            // console.log(hasDom)
            if (hasDom) {
                return v
            }
        },
        dxValueTemplate(v) {
            // console.log('context', this.context, v)
            if (this.curFormCon && this.curFormCon.dxValue) {
                return this.curFormCon.dxValue(this.context, v)
            }
            return []
        }
    }
}

export let provideDxValueTemplateMixin = {
    props: {
        context: null,
    },
    methods: {
        dxValueTemplate(v) {
            let curFormCon = inject('curFormCon')
            // console.log('context', this.context, v)
            return curFormCon.dxValue(this.context, v)
        }
    }
}

export let CUSOM_RENDER_FROM_TYPES = {
    watch: 1,
    init: 2
}

export function defineCustomRender(props = {}, ctx, {handleValueInit} = {}) {
    let instanse = getCurrentInstance()
    let curFormCon = inject('curFormCon')
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    // console.log(props)
    let model = null;
    let data = function (opt) {
        model = reactive({
            value: '',
            OPT: {
                propConfig: props?.prop_config ?? {},
                ui:   props?.ui ?? {},
                widgetConfig: props?.ui?.widgetConfig ?? {}
            },
            ...opt
        })
        return model
    }
    let events = props.ui.events ? props.ui.events : {};

    let refMap = new Map()
    function buildGetRef(key) {
        return function (el) {
            refMap.set(key, el)
        }
    }

    function getRef(key) {
        return refMap.get(key)
    }

    watch(() => props.ui, function (newVal) {
        // console.log('props ui change', newVal)
        let parsedWidgetConfig = newVal?.widgetConfig ?? {}
        if (newVal?.commonWidgetConfig) {
            parsedWidgetConfig = Object.assign(newVal?.commonWidgetConfig, parsedWidgetConfig)
        }
        if (model && model.OPT) {
            model.OPT.ui = newVal
            model.OPT.widgetConfig = parsedWidgetConfig
        }
    })


    let parsedWidgetConfig = props?.ui?.widgetConfig ?? {}
    // console.log(parsedWidgetConfig)
    if (parsedWidgetConfig.common_state) {
        parsedWidgetConfig[parsedWidgetConfig.common_state] = parsedWidgetConfig.common_state
    }

    let FROM_TYPES = CUSOM_RENDER_FROM_TYPES

    async function initValue(newVal, from) {
        if (handleValueInit) {
            model.value = handleValueInit(newVal, from)
        } else {
            model.value = newVal
        }
    }

    watch(() => props.modelValue, (newVal) => {
        // console.log('custom render modelValue', newVal)
        if (!lock.isLocked) {
            // model.value = newVal
            initValue(newVal, FROM_TYPES.watch)
            nextTick(() => {
                if (instanse.ctx.onValueChanged) {
                    instanse.ctx.onValueChanged()
                }
            })
        }
    }, {
    })

    let comManager = inject('comManager')

    function callComManager(name,e ) {
        // console.log('comManager', comManager)
        comManager.context.sendEvent(name,e)
    }

    let methods = {
        callComManager: callComManager,
        onChange(v) {
            lock.lock(async () => {
                // console.log('onChange', v, typeof v)
                ctx.emit('valuechange', v)
            }, 1000)
        },
        on_change(v) {
            lock.lock(async () => {
                // console.log('on_change', v, typeof v)
                ctx.emit('valuechange', v)
            }, 1000)
        }
    }

    // console.log('events', events)

    let listeners = {
    }

    for (let k of ['change']) {
        let fun = new Function('options', `
                return function(v) {
                    if (options.handler ) {
                        options.handler(v)
                    }
                }
            `)

        let handleName = 'on_' + k
        listeners[k] = fun({
            methods,
            handler(v) {
                if (methods[handleName]) {
                    if (events[k]) {
                        methods.callComManager(`${events[k]}`, v)
                    }
                    methods[handleName](v)
                }
            }
        })
    }

    function init(props) {
        // model.value = props.modelValue
        initValue(props.modelValue, FROM_TYPES.init)
        if (instanse.ctx.onValueInited) {
            instanse.ctx.onValueInited()
        }
    }

    function onJSONChange(v = model.value) {
        let str = ZY.JSON5.stringify(v)
        methods.on_change(str)
    }

    function dxValueEval(template) {
        if (curFormCon) {
            return curFormCon.dxValue(props.context, template)
        }
        return null
    }

    let selfpath = props?.defs?.selfpath ?? ''

    let widgetConfig2 = props?.ui?.widgetConfig ?? {}


    function buildOptions() {
        let _widget = model?.OPT?.widgetConfig ?? {}
        let options = dxValueEval(_widget.enums)
        if (!options) {
            options = []
        } else {
            options = ZY.JSON5.parse(ZY.JSON5.stringify(options))
        }


        if (_widget.options2) {
            try {
                let opt = ZY.JSON5.parse(_widget.options2)
                options = options.concat(opt)
            } catch (e) {
                //
            }
        }
        // console.log(_widget, widgetConfig2)
        return options
    }

    function initDefaultVal() {
        setTimeout(() => {
            let v = model.OPT.propConfig.defaultVal
            // console.log('defaultVal', v)
            if (typeof v !== 'undefined') {
                model.value =  v
                ctx.emit('fchange', v)
            }
        }, 100)
    }


    return {
        data,
        buildGetRef,
        getRef,
        curFormCon,
        buildOptions,
        FROM_TYPES,
        widgetConfig2,
        parsedWidgetConfig,
        instanse,
        selfpath,
        dxValueEval,
        onJSONChange,
        initDefaultVal,
        init,
        listeners,
        methods,
    }
}
