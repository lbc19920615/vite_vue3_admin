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
                  hidden: "lt(LENGTH(MODEL('name', '')), 1)",
                },
                debug: "LENGTH(MODEL('name', ''))"
              },
              select1: {
                type: 'string',
                ui: {
                  label: '请假类型',
                  widget: 'CusSelect',
                  widgetConfig: {
                    enums: "VAL('config.constants.types', [])"
                  }
                },
              },
              linkName: {
                type: 'string',
                computedProp: 'doubled',
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
              startTime: {
                type: 'string',
                ui: {
                  label: '开始时间',
                  widget: 'CusDateTimePicker',
                  widgetConfig: {
                    type: "datetime",
                    valueFormat: 'YYYY-MM-DD HH:mm:ss',
                  }
                }
              },
              endTime: {
                type: 'string',
                ui: {
                  label: '结束时间',
                  widget: 'CusDateTimePicker',
                  widgetConfig: {
                    type: "datetime",
                    valueFormat: 'YYYY-MM-DD HH:mm:ss'
                  }
                }
              },
              vantTime: {
                type: 'string',
                ui: {
                  label: 'vant时间',
                  widget: 'VantDateTimePicker',
                  widgetConfig: {
                    drawer: {
                      direction: 'btt',
                      title: "我是标题"
                    },
                    picker: {
                      type: "year-month",
                      title: "选择年月"
                    }
                  }
                }
              }
            }
          },
          computed: {
            doubled: "MODEL('name', '') + ',s'",
            selectedOption: "MODEL('select1', '')",
            haha: "find(VAL('config.constants.types', []), ['value', MODEL('select1', '')])",
            fullRange: "filter([MODEL('startTime', ''), MODEL('endTime', '')])",
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
      }, 300)
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
