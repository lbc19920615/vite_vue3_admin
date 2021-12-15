<template>
<div class="z-echarts-easy" v-if="state.inited">
  <el-button @click="runPart">执行</el-button>
<!--  <el-button @click="exportFile">导出</el-button>-->
  <export-dialog style="display: inline-block" @exported="exportFile"></export-dialog>
  <el-button @click="loadFile">加载</el-button>
<el-row>
  <el-col :span="10" v-if="state.reload">
    <v-json-viewer :value="state.config"></v-json-viewer>
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
      <template #prop_afterbegin="bindData">
<!--        {{pathArrToID(bindData.scope.pathArr)}} -->
        <z-jump-scroll-holder style="height: 1px" :binds="bindData.scope"
                              :id="pathArrToID(bindData.scope.pathArr)">&nbsp;</z-jump-scroll-holder>
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
import { nextTick, onMounted, reactive, toRaw} from "vue";
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
import {createEchartPolar} from "@/plugins/z-frame/components/ZEchartsEasy/configs/polar";
import ExportDialog from "@/components/ExportDialog.vue";
import ZJumpScrollHolder from "@/plugins/z-frame/components/ZJumpScrollHolder.vue";

export default {
  name: "ZEchartsEasy",
  components: {ZJumpScrollHolder, ExportDialog, ZHttpCom, HttpComponent},
  setup() {

    let JSON5 = ZY.JSON5
    let state = reactive({
      inited: false,
      cachedValue: {},
      reload: false,
      config: null
    })
    let widgetFormLocks = true
    let chartId = 'echart_' + ZY.rid(6)

    let chartDom;
    let myChart;
    let option;
    let cachedModel;
    // let echarts;


    function render(config = {}) {
      // console.log(chartDom)
      if (!myChart) {
        chartDom = document.getElementById(chartId);
        myChart = echarts.init(chartDom);
      }
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
      // console.log('render', config, chartDom)
      option = config
      // myChart.clear()
      if (myChart) {
        myChart.clear()
      }
      nextTick(() => {
        setTimeout(() => {
          myChart.setOption(option);
        }, 500)
      })
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

    onMounted( async () => {
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
        polar: createEchartPolar(),
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
            ['label-width', '150px']
          ],
        },
        tag: 'xy-tab',
        properties,
      }
      // console.log('sdsdsdsds')
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

    async function saveModel(v) {
      await ZY_EXT.store.setItem('test-echart', v)
    }

    async function runPart() {
      let model = JSON5.parse(JSON5.stringify(cachedModel))
      Reflect.deleteProperty(model, "config")
      // console.log(model)
      saveModel(cachedModel)
      try {
        let extend = ZY.JSON5.parse(cachedModel.config)
        let o = ZY.lodash.merge({}, extend, model)
        // let o = deepMerge(model, extend)
        state.config = o
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

    function exportFile(form) {
      ZY_EXT.saveDesignFile({
        fileName: 'test_echarts',
        data: cachedModel,
        prefix: 'echarts_',
        ...form
      })
      // console.log('sdsdsds')
    }

    async function loadFile() {
      let obj = await ZY_EXT.fileOpenJSON5()
      if (obj.data) {
        // console.log(obj.data)
        saveModel(obj.data)
        renderData(obj.data)
      }
    }

    function pathArrToID(pathArr) {
      return 'ZECHART__' + pathArr.join('__')
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
      pathArrToID,
      onModelChange,
    }
  }
}
</script>

<style scoped>

</style>
