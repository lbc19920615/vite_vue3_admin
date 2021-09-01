export let plumbLayoutMixn = {
  methods: {
    /**
     * deleteItem
     * @param item
     */
    protect_removeItem(item) {
      let instance = this.instance
      instance.removeAllEndpoints(item.id)
    },
    /**
     * deleteItem
     * @param dep
     * @param item
     * @param index
     */
    deleteItem(dep, item, index) {
      this.protect_removeItem(item)
      dep.items.splice(index,1)
      this.$nextTick(() => {
        this.instance.repaintEverything()
      })
    },
    /**
     * renderItem
     * @param item
     * @param depId
     */
    renderItem(item, depId) {
      let instance = this.instance
      let config = this.config
      this.addEndpoint(item.id, {
        anchors: ['Left']
      }, depId, 'Left')
      this.addEndpoint(item.id, {
        anchors: ['Right']
      }, depId, 'Right')
    },
    /**
     * appendItem
     * @param dep
     */
    async appendItem(dep) {
      let opt = dep
      let newItem = {
        id: opt.id + '-' + ZY.rid(6),
        key: '',
        name: '',
      }
      if (this.handleAppend) {
        this.handleAppend(newItem, dep)
      }
      opt.items.push(newItem)
      await this.$nextTick()
      this.renderItem(newItem, dep.id)
      this.instance.repaintEverything()
    },
  }
}
