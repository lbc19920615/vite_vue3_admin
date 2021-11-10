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
      },
      ui_cached: {
        common: {}
      },
      cus_ref: null
    }
  },
  computed: {
    cus_config() {
      let config = this.ui_config_editor
      let ui_cached_common = this.ui_cached.common
      // console.log(ui_cached_common)
      let _s = deepMerge({
        ui: this.ui ?? {
          widgetConfig: {}
        },
      }, this.self_config ?? {})
      let _c =  deepMerge(_s, config.ins ?? {})
      if (config.common) {
        let _common = config?.common ?? {}
        let commonWidgetConfig = {}
        // console.log(_common)
        if (_common['common_state']) {
          commonWidgetConfig[_common['common_state']] = _common['common_state']
        }
        if (_c && _c.ui) {
          _c.ui.commonWidgetConfig = commonWidgetConfig
          if ( _c.ui.widgetConfig) {
            _c.ui.widgetConfig = {
              ..._common,
              ..._c.ui.widgetConfig
            }
          }
        }

      }

      // console.log('cus_config', _c)
      this.dragxml.onCusConfigChange(this.uuid, _c)
      return _c
    }
  },
  methods: {
    get_cus_ref(el) {
      this.cus_ref = el
      // console.log(this.cus_ref)
    },
    onConfigChanged(e) {
      // console.log('onConfigChanged', e)
      let c = this.dragxml.getConfig(this.uuid)
      if (c.common) {
        this.ui_cached.common = c.common
      }
      this.ui_config_editor = c
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
