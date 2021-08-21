import {inject} from "vue";

export let RefsManagerMixin = function ({
    RefName = 'RefsManager',
    InstanceName = 'RefInstance'
} = {}) {
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
        // console.log(this[InstanceName])
      })
    },
    beforeUnmount() {
      let RefsManager = inject(RefName)
      RefsManager.destory(this, this.uuid)
    }
  }
}

export let slotComEventMixin = function () {
  return {
    props: {
      scope: null
    },
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
        this.RefInstance.emit(name, {
          scope: this.scope,
          context: this.context,
          attrs: attrs,
          parts: attrs.parts,
          params
        })
      }
    }
  }
}
