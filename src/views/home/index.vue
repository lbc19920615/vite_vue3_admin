<template>
  <div>
    {{store}}
  </div>
  <div>
    <el-button type="primary" :disabled="store.model.loading" @click="reload">reload</el-button>
    <el-button type="primary"  :disabled="store.model.loading" @click="updateData">回填数据</el-button>
  </div>
  <div style="min-height: 300px;"
       v-loading="store.model.loading">
    <template v-if="filter('showCom')">
      <HttpComponent
          :defs="allDef"
          :is="store.model.componentStep"
      ></HttpComponent>
    </template>
  </div>
</template>

<script lang="jsx">
import HttpComponent from "../../components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {provideRefManager} from "@/hooks/ref";
import {inject} from "vue";
import {PageControl} from "@/mixins/framework";

export default {
  components: {
    HttpComponent,
  },
  mixins: [
    PageControl
  ],
  setup(props, ctx) {
    let storeControl;
    provideRefManager({
      eventHandler({type, e}) {
        console.log('eventHandler', type, e)
        if (type === 'self:fecthed') {
          storeControl.set({
            loading: false
          })
        }
      }
    })

    let allDef = new Map()

    storeControl = defineAutoStoreControl({
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
          },
          loading: {
            type: Boolean
          }
        }
      },
      computed: {
        // showCom: "ZY_NOT(MODEL('reload'))",
        option1: "nth(CONST('types'), 0)"
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))"
      }
    })

    storeControl.set({
      componentStep: '',
      reload: false,
      loading: false,
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
        reload: true,
        loading: true,
      })
      await ZY.sleep(300)
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
