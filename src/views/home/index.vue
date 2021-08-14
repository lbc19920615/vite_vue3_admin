<template>
  <el-button type="primary" @click="reload">reload</el-button>
  <el-button type="primary" @click="updateData">回填数据</el-button>
  <template v-if="showCom">
    <HttpComponent
        :defs="allDef"
        :is="storeA.componentStep"></HttpComponent>
  </template>
</template>

<script lang="jsx">
import {computed, reactive} from "vue";
import HttpComponent from "../../components/HttpComponent.vue";

export default {
  components: {
    HttpComponent,
    AboutView: globalThis.loadComponent('container.vue'),
  },
  setup() {
    let allDef = new Map()
    allDef.set('process-step1',  {
      init: {
        def: {
          service: 'serviceA',
          row: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                ui: {
                  label: '姓名'
                }
              },
              controls: {
                type: 'string',
                ui: {
                  hidden: "lt(VAL('name', '').length, 1)",
                },
                debug: "VAL('name', '').length"
              },
              linkName: {
                type: 'string',
                computedProp: 'doubled'
              },
              level1: {
                type: "array",
                items: {
                  type: 'object',
                  properties: {
                    linkName1: {
                      type: 'string',
                      computedProp: 'doubled',
                      ui: {
                        label: 'level1 linkName'
                      }
                    }
                  }
                }
              },
              date: {
                type: 'string',
                ui: {
                  label: '范围',
                  widget: 'CusDateTimePicker',
                  widgetConfig: {
                    type: "datetimerange"
                  }
                }
              },
            }
          },
          computed: {
            doubled: "VAL('name', '') + ',s'"
          }
        },
        args: {
          src: 'comformscr.twig'
        }
      }
    })


    let storeA = reactive({
      componentStep: 'process-step1',
      reload: false
    })
    let showCom = computed(() => {
      return !storeA.reload
    })
    function render() {
      return (<div>222232323232</div>)
    }
    function reload() {
      storeA.reload = true
      setTimeout(() => {
        storeA.reload = false
      }, 1000)
    }

    function updateData() {
      global.storeApp.run('serviceA', 'setModel', {
        name: 'namssds'
      })
    }

    return {
      allDef,
      storeA,
      updateData,
      showCom,
      render,
      reload,
    };
  },
};
</script>
