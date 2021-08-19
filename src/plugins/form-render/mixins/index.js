export let RefsManagerMixin = function ({
    RefName = 'RefsManager',
    InstanceName = 'RefInstance'
} = {}) {
  const { inject } = global.Vue
  return {
    data() {
      return {
        uuid: ZY.nid(),
        [InstanceName]: null,
      }
    },
    created() {
      let RefsManager = inject(RefName)
      this[InstanceName] = RefsManager.register(this, this.uuid)
      this[InstanceName].emit('self:created', function (attrs) {
        this[InstanceName].attrs = attrs
        console.log(this[InstanceName])
      })
    },
    beforeUnmount() {
      let RefsManager = inject(RefName)
      RefsManager.destory(this, this.uuid)
    }
  }
}

export let slotComEventMixin = function () {
  const { inject } = global.Vue
  return {
    data() {
      return {
        context: null,
        slotContainer: null,
        version: null
      }
    },
    created() {
      this.context = inject('curFormCon')
      this.slotContainer = inject('slotComRefManager')
    },
    methods: {
      fireEvent(name, params) {
        let attrs = this.slotContainer.attrs ? this.slotContainer.attrs : {}
        this.RefInstance.emit('submit:form', {
          context: this.context,
          attrs: attrs,
          parts: attrs.parts,
          params
        })
      }
    }
  }
}
