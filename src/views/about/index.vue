<style lang="scss">
.vue-grid-item {
  color: #ffffff;

}

.layout-level-0 {
  .vue-column-item {
    background-color: #ebebeb;
  }
}

.layout-level-1 {
  .vue-row-item {
    background-color: #99a9bf;
  }
}

.render-layout-level-2 {
  width: 100%;
  .vue-column-item {
    background-color: #001528;
  }
}

</style>

<template>
  <div class="page-search">
    <render-layout :map="currentLayoutMap"
                   :id="rootId"
                   :handleNext="handleNext"
    ></render-layout>
    <div>
      {{currentLayoutMap}}
    </div>
    <PlumbLayout :root-id="rootId"
                 :handleAppend="handleAppend"
                 @save-data="onGetData"
      @edit-dep="onEditDep"
    ></PlumbLayout>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineComponent} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";

let depManagerMixin = {
  methods: {
    onEditDep(dep) {
      console.log('onEditDep', dep)
    }
  }
}

let renderLayoutMixin = {
  methods: {
    handleNext(item) {
      // console.log(this.currentLinks, item.id)
      let fromId = item.id
      let connections = this.currentLinks.filter(v => v.from === fromId)
      if (connections) {
        // console.log('from', connections)
        // return connection.toPID
        if (Array.isArray(connections) && connections[0]) {
          return connections[0].toPID
        }
        return ''
      }
      return ''
    }
  }
}

let plumbLayoutMixin = {
  data() {
    return {
      currentLinks: [],
      currentLayoutMap: {},
    }
  },
  methods: {
    handleAppend(newItem, dep) {
      // console.log('newItem', dep)
      if (dep.type === 'column') {
        newItem.h = 120
      }
      if (dep.type === 'row') {
        newItem.w = '1fr'
        newItem.h = 50
      }
    },
    onGetData({deps, links = []}) {
      console.log('onGetData', deps, links)
      let map = {
        [this.rootId]: deps.find(v => v.id === this.rootId)
      }
      links.forEach(link => {
        let { toPID = '' } = link
        if (toPID) {
          let dep = deps.find(v => v.id === toPID)
          if (dep) {
            map[toPID] = dep
          }
        }
      })
      this.currentLayoutMap = JSON.parse(JSON.stringify(map))
      this.currentLinks = JSON.parse(JSON.stringify(links))
    }
  }
}

export default defineComponent({
  mixins: [
    plumbLayoutMixin,
    renderLayoutMixin,
    depManagerMixin,
  ],
  data() {
    let demoColumn = {
      type: 'column',
      data: [
        {
          h: 120,
        },
        {
          h: 120,
          to: 'id222'
        },
      ]
    }

    let demoRow = {
      type: 'row',
      data: [
        {
          w: 240,
          h: 120,
          to: 'id333'
        },
      ]
    }

    let demoColumn2 = {
      type: 'column',
      data: [
        {
          h: 30,
        },
        {
          h: 30,
        },
      ]
    }

    return {
      rootId: 'i1',
      layoutMap: {
        'id1111': demoColumn,
        'id222': demoRow,
        'id333': demoColumn2
      },
      layout: [
        demoColumn,
      ]
    }
  },
  methods: {},
  components: {
    PlumbLayout,
    RenderLayout,
    GridRow,
    // 'tableA': globalThis.loadComponent('tabledef.vue', '&config_id=s1212121222sss1212121')
  }
})
</script>
