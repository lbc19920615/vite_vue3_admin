// import deepMerge from 'deepmerge'

export let ZDragHighlightMixin = {
  inject: ['dragxml'],
  data() {
    return {}
  },
  methods: {
    zdrag__highlight_cls(key, value) {
      let isHighLight = false
      let current = this.dragxml.getCurrent()
      if (current.origin && current.origin[key]) {
        isHighLight = (value === current.origin[key])
        if (key === 'layoutUUID') {
          // console.log(key, current.origin[key], value)
        }
      }
      if (isHighLight) {
        this.dragxml.highLight(this)
      }
      return {
        ['z-drag-highlight']: isHighLight
      }
    }
  }
}

export let ZDragCommonMixin = {
  inject: ['dragxml', 'draginit', 'cusDragXml'],
  mixins: [
    ZDragHighlightMixin
  ],
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
      ui_config_editor: this.dragxml.getConfig(this.uuid) ?? {
        ui: {
          widgetConfig: {}
        }
      },
      ui_cached: {
        common: {}
      },
      cus_ref: null,
      locked: false
    }
  },
  computed: {
    form_config() {
      if (this.cusDragXml && this.cusDragXml.getFormConfig) {
        return this.cusDragXml.getFormConfig()
      }
      return {}
    },
    zdrag__form_config() {
      if (this.cusDragXml && this.cusDragXml.getFormConfig) {
        return this.cusDragXml.getFormConfig()
      }
      return {}
    },
    cus_config() {
      let config = this.ui_config_editor ?? { }
      // let config = this.dragxml.getConfig(this.uuid)
      // let ui_cached_common = this.ui_cached.common
      // console.log(ui_cached_common)
      let _s = Object.assign({
        ...this.INIT_CONFIG ?? {},
        ui: this.ui ?? {
          widgetConfig: {}
        },
      }, this.self_config ?? {})
      let _c =  ZY.lodash.merge(_s, config.ins ?? {})
      // if (config.common) {
      //   let _common = config?.common ?? {}
      //   let commonWidgetConfig = {}
      //   // console.log(_common)
      //   if (_common['common_state']) {
      //     commonWidgetConfig[_common['common_state']] = _common['common_state']
      //   }
      //   if (_c && _c.ui) {
      //     _c.ui.commonWidgetConfig = commonWidgetConfig
      //     if ( _c.ui.widgetConfig) {
      //       _c.ui.widgetConfig = {
      //         ..._common,
      //         ..._c.ui.widgetConfig
      //       }
      //     }
      //   }
      //
      // }
if (!_c.server) {
  _c.server = {}
}
if (!_c.server.field_name) {
  _c.server.field_name = 'field__' + ZY.rid(10)
}
      // console.log('cus_config', _c, this)
      if (this.locked) {
        this.locked = false
      } else {
        this.dragxml.onCusConfigChange(this.uuid, _c)
      }
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
      // if (c.common) {
      //   this.ui_cached.common = c.common
      // }
      this.ui_config_editor = c
    },
    GET_CONFIG(path, defaultVal) {
      return ZY.lodash.get(this.cus_config, path, defaultVal)
    },
    zdrag__GET_CONFIG(path, defaultVal) {
      return ZY.lodash.get(this.cus_config, path, defaultVal)
    },
    onMouseEnter(e) {
      // console.log('onMouseEnter', e)
      this.dragxml.onMouseEnter(e)
    },
    onMouseLeave(e) {
    },
    zdrag__onMouseEnter(e) {
      // console.log('onMouseEnter', e)
      this.dragxml.onMouseEnter(e)
    },
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
