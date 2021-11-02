<style>

</style>

<template>
  <div class="z-http-com" v-if="page.inited">
<!--    {{valueConfig}}-->
<!--    {{store.model}}-->
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
        :debug="debug"
    >
      <template #object_beforebegin="scope">
        <div>
         <h3>{{scope.label}}</h3>
         <slot name="z_http_com-object_beforebegin" v-bind="{scope, page}"></slot>
        </div>
      </template>

      <template #prop_label_beforeend="scope">
        <template v-if="scope.config">
          <z-window v-if="scope.config.noticeIframe"
                    :target="scope.config.noticeTarget"
                    :url="scope.config.noticeIframe">
            <i class="fa fa-book"></i>
          </z-window>

          <slot name="prop_label_beforeend" v-bind="{cached: store.model.cached, scope}"></slot>

          <z-window v-if="scope.config.noticeFun"
                    :ref="getNoticeFunRef(scope)"
          >
            <i class="fa fa-book"></i>
          </z-window>
          <z-tooltip trigger="click"
                     v-if="scope.config.ui && scope.config.ui.notice"
                     :tooltip="scope.config.ui ? scope.config.ui.notice : ''"></z-tooltip>
        </template>
      </template>
      <template #array_con_afterbegin="scope">
<!--        <el-divider></el-divider>-->
      </template>
      <template #array_beforebegin="scope">
        <div>
          <h3>{{ scope.label }}</h3>
          <el-button type="primary" size="small"
                     @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)"
          >添加{{ scope.label }}</el-button>
        </div>
      </template>
      <template #array_afterbegin="scope">

      </template>
      <template #array_con_beforeend="scope">
        <div>
          <el-button type="danger" size="small"
              @click="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)"
          >删除{{ scope.label }}</el-button>
        </div>
      </template>
    </HttpComponent>
  </div>
</template>

<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {onBeforeUnmount, onMounted, toRaw} from "vue";
import ZTooltip from "@/plugins/z-frame/components/ZTooltip.vue";
import ZWindow from "@/plugins/z-frame/components/ZWindow.vue";
export default {
  name: 'ZHttpCom',
  components: {ZWindow, ZTooltip, HttpComponent},
  emits: [
    'http:model:change',
    'form:input:blur'
  ],
  props: {
    value: null,
    resolveConfig: Function,
    debug: Boolean
  },
  data() {
    return {
      loading: false,
    }
  },
  setup(props, ctx) {
    let locks = true
    let cachedModel = {}
    let properties =  {
      editor_step: {
        type: String,
      },
      cached: {
        type: null
      },
      refreshed: {
        type: Boolean
      }
    }
    let computed = {}
    function onInited({storeControl}) {
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)
    let { EVENT_NAMES, onChange } = extendCommonArrEventHandler(page)

    onChange( (type, e) => {
      let { parts, partName, selfpath, process } = e
      let model = parts[partName].getModel()
      let newVal = toRaw(model)
      // console.log(type, e, toRaw(model))
      ctx.emit('update:value', newVal)
      ctx.emit('change', newVal)
    })

    page.setEventHandler({
      ['model:update:all'](e) {
        // console.log('sdsdsds', locks)
        cachedModel = toRaw(e.model)
        page.setByPath('cached', cachedModel)
        page.setByPath('refreshed', false)
        setTimeout(() => {
          page.setByPath('refreshed', true)
        }, 300)
        if (!locks) {
          ctx.emit('http:model:change', e)
        }
      },
      ['form:input:blur'](e) {
        // console.log('sdsdsdsdsdsds', e)
        ctx.emit('form:input:blur', e)
      }
    })

    function getForm2Config(config) {
      return config.init.def.parts[0].def
    }

    onMounted(function () {

      let loaded =  async function () {
        let res = await props.resolveConfig(props)
        // console.log(res)
        let config = ZY.JSON5.parse(ZY.JSON5.stringify(res.default))

        return {
          default: config
        }
      }
      page.commonLoadStep(
          loaded(),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              let form2Config = getForm2Config(config)

              if (props.value) {
                setPartModel(config.name, 'form2', props.value)
              }
              locks = false
              // console.log('eventModel', config, page.defMap)
            }
          }
      )
    })

    function getZWindowUrl(funArr, scope) {
      let fun = new Function(funArr[0], funArr[1])
      // console.log(scope)
      let {parts, partName, pathArr} = scope

      function getData(pathArr) {
        return parts[partName].getModelByPathArr(pathArr)
      }

      return fun({
        pathArr,
        getData,
        model: cachedModel
      })
    }

    let _getNoticeFunRef = null
    function getNoticeFunRef(scope) {
      // getZWindowUrl(scope.config.noticeFun, scope)
      return function (v) {
        _getNoticeFunRef = v
        // console.log(scope, v)
        if (_getNoticeFunRef) {
          _getNoticeFunRef.address = getZWindowUrl(scope.config.noticeFun, scope)
        }
      }
    }

    return {
      EVENT_NAMES,
      getZWindowUrl,
      getNoticeFunRef,
      page,
      cachedModel,
      store: page.store
    }

  }
}
</script>
