import deepMerge from 'deepmerge'

export let ZDragCommonMixin = {
  inject: ['dragxml', 'draginit'],
  emits: [
    'move-enter'
  ],
  props: {
    layout_uuid: String,
    uuid: String
  },
  data() {
    // console.log(this.uuid)
    return {
      ui_config_editor: {
        ui: {
          widgetConfig: {}
        }
      }
    }
  },
  computed: {
    cus_config() {
      let config = this.ui_config_editor ?? {
        ui: {
          widgetConfig: {}
        }
      }
      // console.log('config', config)
      let _s = deepMerge({
        ui: this.ui ?? {
          widgetConfig: {}
        },
      }, this.self_config ?? {})
      let _c =  deepMerge(_s, config.ins ?? {})
      if (config.common) {
        _c  = deepMerge(_c, {
          ui: {
            widgetConfig: config.common ?? {}
          }
        })
      }
      this.dragxml.onCusConfigChange(this.uuid, _c)
      return _c
    }
  },
  methods: {
    onConfigChanged(e) {
      // console.log('onConfigChanged', e)
      this.ui_config_editor = this.dragxml.getConfig(this.uuid)
    },
    GET_CONFIG(path, defaultVal) {
      return ZY.lodash.get(this.cus_config, path, defaultVal)
    },
    onMouseEnter(e) {
      // console.log('onMouseEnter', e)
      this.dragxml.onMouseEnter(e)
    },
    onMouseLeave(e) {

    }
  },
  mounted() {
    this.dragxml.register(this.uuid, this)
    this.dragxml.emitter.on(
      this.dragxml.EVENTS.CHANGED,
      this.onConfigChanged
    )
  },
  beforeUnmount() {
    this.dragxml.unRegister(this.uuid)
    this.dragxml.emitter.off(
      this.dragxml.EVENTS.CHANGED,
      this.onConfigChanged
    )
  }
}
