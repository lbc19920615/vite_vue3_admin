import {reactive, watch} from "vue";

export let CustomRenderControlMixin = {
    props: {
        modelValue: null,
        ui: {
            type: Object,
            default() {
                return {}
            }
        },
        config: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    emits: [
        'value-change'
    ]
}

export function defineCustomRender(props = {}, ctx) {

    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let model = null
    let data = function () {
        model = reactive({
            value: ''
        })
        return model
    }

    watch(() => props.modelValue, (newVal) => {

        if (!lock.isLocked) {
            model.value = newVal
        }
    })

    let methods = {
        onChange(v) {
            // console.log('sdsdsds', v)
            lock.lock(async () => {


                ctx.emit('value-change', v)
            }, 1000)
        }
    }

    return {
        data,
        methods
    }
}
