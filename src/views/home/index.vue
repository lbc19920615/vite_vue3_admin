<template>
  <div>
    {{store}}
  </div>
  <el-button type="primary" @click="reload">reload</el-button>
  <el-button type="primary" @click="updateData">回填数据</el-button>
  <template v-if="filter('showCom')">
    <HttpComponent
        :defs="allDef"
        :is="store.model.componentStep"></HttpComponent>
  </template>
</template>

<script lang="jsx">
import HttpComponent from "../../components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";

export default {
  components: {
    HttpComponent,
  },
  setup(props, ctx) {
    let allDef = new Map()

    let storeControl = defineAutoStoreControl({
      service: 'serviceB',
      constants: {
        types: [
          {
            label: '事假',
            value: 'sds1212121sds'
          },
          {
            label: '病假',
            value: 'sds121212ds'
          }
        ]
      },
      data: {
        type: 'object',
        properties: {
          componentStep: {
            type: String,
          },
          reload: {
            type: Boolean
          }
        }
      },
      computed: {
        showCom: "ZY_NOT(MODEL('reload'))",
        option1: "nth(CONST('types'), 0)"
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))"
      }
    })


    storeControl.set({
      componentStep: '',
      reload: false
    })

    import('./step1.js').then(res => {
      const config = res.default
      allDef.set(config.name, config)
      // storeA.componentStep = config.name
      storeControl.set({
        componentStep: config.name
      })
    })


    function render() {
      return (<div>222232323232</div>)
    }

    async function reload() {
      storeControl.set({
        reload: true
      })
      await ZY.sleep(1000)
      storeControl.set({
        reload: false
      })
    }

    function updateData() {
      global.storeApp.run('serviceA', 'setModel', {
        name: 'namssds'
      })
    }

    return {
      store: storeControl.store,
      filter: storeControl.filter,
      allDef,
      updateData,
      render,
      reload,
    };
  },
};
</script>
