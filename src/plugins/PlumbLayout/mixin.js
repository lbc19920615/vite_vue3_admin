export let plumbActionMixins = {
  methods: {
    /**
     * getVisibleConnections
     */
    getVisibleConnections() {
      let allConnections = this.instance.getConnections({

      });
      let ret = []
      ret = allConnections.filter(v => {
        return v.target && v.source
      })
      return ret
    },
    /**
     * getLinkRealtions
     */
    getLinkRealtions() {
      let allVisibleConnections = this.getVisibleConnections()
      let ret = []
      ret = allVisibleConnections.map(v => {
        return {
          toPID: v.target.dataset.pid,
          fromPID: v.source.dataset.pid,
          from: v.sourceId,
          to: v.targetId
        }
      })
      // console.log(ret)
      return ret
    }
  }
}

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

    getLinks() {
      let links = this.getLinkRealtions()

      let eventLinks = []

      eventLinks = links.filter(v => {
        let from = v.from
        return from.endsWith('-evt')
      })

      let comLinks = []
      let notCanLinks = [
        'evt',
        'fun'
      ]
      comLinks = links.filter(v => {
        let from = v.from
        let isMatched = notCanLinks.some(v => {
          return from.endsWith(v)
        })
        // console.log('v', isMatched)
        return v.to.endsWith('top') && !isMatched
      })
      return {
        eventLinks,
        comLinks,
      }
    },

    getToolsData() {
      let links = this.getLinks()
      let data = {
        deps: this.deps,
        eventLinks: links.eventLinks,
        links: links.comLinks,
      }
      let posMap = {}
      return {
        data,
        posMap,
      }
    },

    /**
     *
     * @param o
     */
    importToolsData(o = {data:{deps: [], links: [], eventLinks: []}, postMap: {}}) {
      let {data, posMap} = o
      console.log('importToolsData', data, posMap)
    }
  }
}
