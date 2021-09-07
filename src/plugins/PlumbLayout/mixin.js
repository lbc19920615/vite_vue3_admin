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
  data() {
    return {
      posCssObj: {},
      posMap: {},
      comId: 'plumb_layout_' + ZY.rid(6)
    }
  },
  methods: {
    /**
     *
     * @param id
     * @param instance
     * @param items
     */
    makeDraggable(id, instance, items) {
      let self = this
      instance.draggable(id, {
        stop: function(event, ui) {
          // Your code
          // console.log('sdsdsds', event.finalPos)
          self.posMap[id] = {
            pos: event.finalPos
          }
        }
      })
    },
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
      let posMap = this.posMap
      return {
        data,
        posMap,
      }
    },

    async usePosMap() {
      let posMap = await ZY_EXT.store.getItem('play-posMap') ?? null
      // console.log('cached', cached)
      this.loadPosMap(posMap)
      return ''
    },

    loadPosMap(posMap) {

      if (posMap) {
        let styleObj = {

        }
        for (let [key, value] of Object.entries(posMap)) {
          styleObj[`[dep-name="${key}"]`] = {
            left: `${value.pos[0]}px`,
            top: `${value.pos[1]}px`,
          }
        }
        let style = {
          ['#' + this.comId] : styleObj
        }
        // console.log(style)
        this.posCssObj = ZY_EXT.cssObj(style)
      }
      this.posMap = posMap
    },

    /**
     *
     * @param o
     */
    async importToolsData(o = {data:{deps: [], links: [], eventLinks: []}, postMap: {}}) {
      let {data, posMap} = o

      this.loadPosMap(posMap);
      await ZY.sleep(300)

      // console.log('importToolsData', data, posMap)
      this.deps = data.deps
      await this.$nextTick()
      this.insDeps(this.deps)
      await ZY.sleep(300)
      this.insEventLinks(data.eventLinks)
      this.insComLinks(data.links)


    },



    async saveCache2Storage(data = {data: {deps: [], links: []},  posMap : {}}) {
      ZY_EXT.store.setItem('play-deps', ZY.JSON5.parse(ZY.JSON5.stringify(data.data.deps)))
      ZY_EXT.store.setItem('play-links', ZY.JSON5.parse(ZY.JSON5.stringify(data.data.links)))
      ZY_EXT.store.setItem('play-posMap', ZY.JSON5.parse(ZY.JSON5.stringify(data.posMap)))
    }
  }
}
