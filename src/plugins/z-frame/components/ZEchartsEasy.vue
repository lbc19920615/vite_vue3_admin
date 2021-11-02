<template>
<div class="z-echarts-easy" v-if="state.inited">
  <el-button @click="runPart">执行</el-button>
  <el-button @click="exportFile">导出</el-button>
  <el-button @click="loadFile">加载</el-button>
<el-row>
  <el-col :span="10" v-if="state.reload">
    <z-http-com :value="state.cachedValue"
                :debug="true"
                :resolve-config="resolveConfig"
                @http:model:change="onModelChange">
      <template #z_http_com-object_beforebegin="bindData">
        <el-space v-if="needObjAction(bindData)">
          <el-button  size="small"
                     @click="iniObj(bindData)"
          >初始化{{ bindData.scope.label }}</el-button>
          <el-button  size="small"
                     @click="desObj(bindData)"
          >销毁{{ bindData.scope.label }}</el-button>
        </el-space>
      </template>
      <template #prop_label_beforeend="bindData">
<!--        {{bindData.scope}}-->
      </template>
    </z-http-com>
  </el-col>
  <el-col :span="14">
    <div style="width: 600px; height: 400px;" :id="chartId"></div>
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
import {EXTEND_FRAME_EVENT_NAMES} from "@/mixins/framework";
import {createEchartTooltip} from "@/plugins/z-frame/components/ZEchartsEasy/configs/tooltip";
import {createEchartTitle} from "@/plugins/z-frame/components/ZEchartsEasy/configs/title";
import {createEchartLegend} from "@/plugins/z-frame/components/ZEchartsEasy/configs/legend";
import {createEchartGrid} from "@/plugins/z-frame/components/ZEchartsEasy/configs/grid";
import {createEchartToolbox} from "@/plugins/z-frame/components/ZEchartsEasy/configs/toolbox";

export default {
  name: "ZEchartsEasy",
  components: {ZHttpCom, HttpComponent},
  setup() {

    let JSON5 = ZY.JSON5
    let state = reactive({
      inited: false,
      cachedValue: {},
      reload: false
    })
    let widgetFormLocks = true
    let chartId = 'echart_' + ZY.rid(6)

    let chartDom;
    let myChart;
    let option;
    let cachedModel;


    function render(config = {}) {
      // console.log(chartDom)
      chartDom = document.getElementById(chartId);
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
      console.log('render', config, chartDom)
      option = config
      myChart.setOption(option);
    }


    function renderData(o) {
      state.reload = false
      let base = {
        xAxis: {},
        yAxis: {},
        series: [],
        tooltip: {},
      }
      state.cachedValue = Object.assign(base, o)
      setTimeout(() => {
        state.reload = true
      }, 100)
    }

    onMounted(async () => {
      // render()
      state.inited = true
      let o = await ZY_EXT.store.getItem('test-echart')
      renderData(o)
    })

    async function resolveConfig() {
      let properties = {

        series: createEchartSeries(),
        xAxis: createEchartXAxis(),
        yAxis: createEchartYAxis(),
        tooltip: createEchartTooltip(),
        title: createEchartTitle(),
        legend: createEchartLegend(),
        grid: createEchartGrid(),
        toolbox: createEchartToolbox(),
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

    function iniObj({scope, page} = {}) {
      page.callEvent(EXTEND_FRAME_EVENT_NAMES.OBJ_INIT_COMMON,scope)
    }

    function desObj({scope, page} = {}) {
      page.callEvent(EXTEND_FRAME_EVENT_NAMES.OBJ_DESTORY_COMMON,scope)
    }

    let objActionKeys = ['areaStyle']
    function needObjAction({scope} = {}) {
      // console.log(scope)
      // return objActionKeys.includes(scope.key)
      return true
    }

    function exportFile() {
      ZY_EXT.saveDesignFile({
        fileName: 'test_echarts',
        data: cachedModel,
        prefix: 'echarts_'
      })
    }

    async function loadFile() {
      let obj = await ZY_EXT.fileOpenJSON5()
      if (obj.data) {
        console.log(obj.data)
        renderData(obj.data)
      }
    }

    return {
      resolveConfig,
      state,
      runPart,
      iniObj,
      needObjAction,
      chartId,
      loadFile,
      exportFile,
      desObj,
      onModelChange,
    }
  }
}
</script>

<style scoped>

</style>
