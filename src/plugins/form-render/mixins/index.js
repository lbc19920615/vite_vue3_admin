import {inject} from "vue";

export let RefsManagerMixin = function ({
    RefName = 'RefsManager',
    InstanceName = 'RefInstance'
} = {}) {
  return {
    data() {
      return {
        uuid: ZY.nid(),
        [InstanceName]: null
      }
    },
    created() {
      let RefsManager = inject(RefName)
      this[InstanceName] = RefsManager.register(this, this.uuid)
    },
    beforeUnmount() {
      let RefsManager = inject(RefName)
      RefsManager.destory(this, this.uuid)
    }
  }
}
