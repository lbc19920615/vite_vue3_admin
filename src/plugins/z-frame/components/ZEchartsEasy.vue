<template>
<div class="z-echarts-easy" v-if="state.inited">
  <el-button @click="runPart">执行</el-button>
<el-row>
  <el-col :span="10">
    <z-http-com :value="state.cachedValue"
                :debug="true"
                :resolve-config="resolveConfig"
                @http:model:change="onModelChange"></z-http-com>
  </el-col>
  <el-col :span="14">
    <div style="width: 600px; height: 400px;" id="echart-con"></div>
  </el-col>
</el-row>
</div>
</template>

<script>
import * as echarts from 'echarts';
import {getCurrentInstance, onMounted, reactive, toRaw} from "vue";
import HttpComponent from "@/components/HttpComponent.vue";
import ZHttpCom from "@/plugins/z-frame/components/ZHttpCom.vue";
import {createCusWidgetEditorConfig} from "@/plugins/form-render/components/CusWidgetEditor/createConfig";
import {createEchartXAxis} from "@/plugins/z-frame/components/ZEchartsEasy/configs/xAsix";
import {createEchartYAxis} from "@/plugins/z-frame/components/ZEchartsEasy/configs/yAsix";
import {createEchartSeries} from "@/plugins/z-frame/components/ZEchartsEasy/configs/series";

export default {
  name: "ZEchartsEasy",
  components: {ZHttpCom, HttpComponent},
  setup() {

    let JSON5 = ZY.JSON5
    let state = reactive({
      inited: false,
      cachedValue: {}
    })
    let widgetFormLocks = true

    let chartDom;
    let myChart;
    let option;
    let cachedModel;


    function render(config = {}) {
      // console.log(chartDom)
      chartDom = document.getElementById('echart-con');
      myChart = echarts.init(chartDom);
      // option = {
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       data: [150, 230, 224, 218, 135, 147, 260],
      //       type: 'line'
      //     }
      //   ]
      // };
      console.log('render', config)
      option = config
      myChart.setOption(option);
    }

    onMounted(async () => {
      // render()
      state.inited = true
      let o = await ZY_EXT.store.getItem('test-echart')
      let base = {
        xAxis: {},
        yAxis: {},
        series: []
      }
      state.cachedValue = Object.assign(base, o)
    })

    async function resolveConfig() {
      let properties = {

        series: createEchartSeries(),
        xAxis: createEchartXAxis(),
        yAxis: createEchartYAxis(),
        config: {
          type: 'string',
          ui: {
            widgetConfig: {
              type: 'textarea',
              rows: 3
            }
          }
        },
      }
      let computed = {}
      let formDef = {
        type: 'object',
        ui: {
          attrs: [
            ['label-width', '120px']
          ],
        },
        properties,
      }
      return {
        default: createCusWidgetEditorConfig(formDef,
            computed
        )
      }
    }

    async function onModelChange(e) {
      if (widgetFormLocks) {
        widgetFormLocks = false
        cachedModel = toRaw(e.model)
        // console.log(e.model)
      }
    }

    function deepMerge(model, extend) {
      let o = {}
      ZY.lodash.each(model, function (item, key) {
        o[key] = ZY.lodash.merge({}, item, extend[key])
      })
      return o
    }

    async function runPart() {
      let model = JSON5.parse(JSON5.stringify(cachedModel))
      Reflect.deleteProperty(model, "config")
      console.log(model)
      await ZY_EXT.store.setItem('test-echart', cachedModel)
      try {
        let extend = ZY.JSON5.parse(cachedModel.config)
        let o = ZY.lodash.merge({}, extend, model)
        // let o = deepMerge(model, extend)
        render(o)
      } catch (e) {
        console.log(e)
      }
    }

    return {
      resolveConfig,
      state,
      runPart,
      onModelChange,
    }
  }
}
</script>

<style scoped>

</style>
