export let ZDragCommonMixin = {
  inject: ['dragxml'],
  props: {
    layout_uuid: String,
    uuid: String
  },
  data() {
    // console.log(this.uuid)
    return {
      ui_config_editor: {}
    }
  },
  computed: {
    ui_config() {
      let config = this.ui_config_editor ?? {}
      // console.log('config', config)
      return {
       ...this.ui ?? {},
         ...config,
      }
    }
  },
  methods: {
    onConfigChanged(e) {
      // console.log('onConfigChanged', e)
      this.ui_config_editor = this.dragxml.getConfig(this.uuid)
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
