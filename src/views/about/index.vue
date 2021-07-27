<style lang="scss">
.vue-grid-item {
  color: #ffffff;
}

@function random-rgb() {
  @return rgb(random(255), random(255), random(255))
}

@mixin random-bgr(){
  background: random-rgb();
}

@for $i from 0 through 10 {
  .render-layout-level-#{$i} {
    width: 100%;
    .vue-column-item {
      @include random-bgr();
    }
    .vue-row-item {
      @include random-bgr();
    }
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
    <el-row type="flex">
      <PlumbLayout :root-id="rootId"
                   :handleAppend="handleAppend"
                   @save-data="onGetData"
                   @edit-dep="onEditDep"
      ></PlumbLayout>

      <div style="flex: 1" v-loading="renderFormLoading">
        <template v-if="renderFormDesigner">
          {{currentEditDep.type}}
          <search-demo1 v-if="currentEditDep.type === 'row'"
                        @init="onInitDemo1" :modelValue="currentEditDep">
            <template v-slot:key1__array__before="{items, index}">
              <header>{{index}}</header>
            </template>
          </search-demo1>
          <search-demo2 v-if="currentEditDep.type === 'column'"
                        @init="onInitDemo1" :modelValue="currentEditDep">
            <template v-slot:key1__array__before="{items, index}">
              <header>{{index}}</header>
            </template>
          </search-demo2>
        </template>
      </div>
    </el-row>
    <!--    <table-a></table-a>-->
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent} from "vue";
import GridRow from "@/views/about/components/grid-row.vue";
import RenderLayout from "@/views/about/components/render-layout.vue";
import PlumbLayout from "@/views/about/components/PlumbLayout.vue";

let formDesignerMixin = {
  components: {
    ['search-demo1']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=formDesigner/index.twigvue&config_id=layoutDesigner.json5")
    }),
    ['search-demo2']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=formDesigner/index.twigvue&config_id=layoutColumn.json5")
    })
  },
  data() {
    return {
      searchDemo1Ref: null
    }
  },
  methods: {
    onInitDemo1(context) {
      this.searchDemo1Ref = context
      console.log( this.currentEditDep )
      context.setModel(this.currentEditDep)
    }
  }
}

let depManagerMixin = {
  data() {
    return {
      renderFormLoading: false,
      renderFormDesigner: false,
      currentEditDep: null
    }
  },
  methods: {
    onEditDep(dep) {
      // console.log('onEditDep', dep)
      this.renderFormLoading = true
      this.renderFormDesigner = false
      this.currentEditDep = dep
      this.$nextTick(() => {
        setTimeout(() => {
          this.renderFormLoading = false
          this.renderFormDesigner = true
        }, 30)
      })
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
    formDesignerMixin,
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
