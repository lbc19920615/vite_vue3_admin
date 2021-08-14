import {reactive, watch, inject} from "vue";

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
        'valuechange'
    ],
    data() {
      return {
          curFormCon: null,
          inited: false
      }
    },
    mounted() {
        this.curFormCon = inject('curFormCon')
        this.inited = true
        // console.log(this.curFormCon)
    }
}

export function defineCustomRender(props = {}, ctx) {

    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let model = null
    let data = function (opt) {
        model = reactive({
            value: '',
            ...opt
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
            lock.lock(async () => {

                // console.log('sdsdsds', v)
                // ZY.PubSub.publish('value-change', v)
                ctx.emit('valuechange', v)
            }, 1000)
        }
    }

    return {
        data,
        methods
    }
}
