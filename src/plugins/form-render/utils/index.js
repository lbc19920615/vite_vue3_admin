import {reactive, watch, inject, getCurrentInstance, nextTick} from "vue";

export let CustomRenderControlMixin = {
    props: {
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
        defs: {
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
        }
    },
    emits: [
        'valuechange'
    ],
    inject: ['curFormCon'],
    data() {
      return {
          // curFormCon: null,
          inited: false
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
            return this.curFormCon.dxValue(this.context, v)
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

export function defineCustomRender(props = {}, ctx, {handleValueInit} = {}) {
    let instanse = getCurrentInstance()
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let model = null;
    let data = function (opt) {
        model = reactive({
            value: '',
            ...opt
        })
        return model
    }
    let events = props.ui.events ? props.ui.events : {};

    let FROM_TYPES = {
        watch: 1,
        init: 2
    }

    async function initValue(newVal, from) {
        if (handleValueInit) {
            model.value = handleValueInit(newVal, from)
        } else {
            model.value = newVal
        }
    }

    watch(() => props.modelValue, (newVal) => {
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
                // console.log('sdsdsds', v)
                // ZY.PubSub.publish('value-change', v)
                ctx.emit('valuechange', v)
            }, 1000)
        },
        on_change(v) {
            lock.lock(async () => {
                // console.log('sdsdsds', v)
                // ZY.PubSub.publish('value-change', v)
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

    return {
        data,
        FROM_TYPES,
        onJSONChange,
        init,
        listeners,
        methods,
    }
}
