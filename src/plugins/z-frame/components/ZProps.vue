

<template>
  <div class="z-props" v-if="page.inited">
<!--    {{valueConfig}}-->
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
    >
      <template #array_con_afterbegin="scope">
<!--        <el-divider></el-divider>-->

      </template>
      <template #array_afterbegin="scope">
       <div class="z-props__action">
<!--         <h3>{{ scope.key }}</h3>-->
         <el-button type="primary" size="small" class="z-props__add"
             @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)">添加</el-button>
       </div>
      </template>
      <template #array_con_beforeend="scope">
        <div class="z-props__action">
          <el-button type="danger" size="small" class="z-props__del"
              @click="page.callEvent(EVENT_NAMES.ARR_REMOVE_COMMON, scope)">删除</el-button>
        </div>
      </template>
    </HttpComponent>
  </div>
</template>

<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {onBeforeUnmount, onMounted, toRaw} from "vue";
export default {
  name: 'ZProps',
  components: {HttpComponent},
  emits: [
    'props-change',
      'form:input:blur'
  ],
  props: {
    value: null,
    valueConfig: Object,
    nameConfig: Object
  },
  data() {
    return {
      loading: false,
    }
  },
  setup(props, ctx) {
    let locks = true
    let properties =  {
      editor_step: {
        type: String,
      },
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
      // console.log('type', type, model)
      if (type === EVENT_NAMES.ARR_REMOVE_COMMON) {
        ctx.emit('props-change', model)
        ctx.emit('form:input:blur', '')
      }

      if (type === EVENT_NAMES.ARR_APPEND_COMMON) {
        ctx.emit('props-change', model)
        ctx.emit('form:input:blur', '')
      }

    })

    page.setEventHandler({
      ['model:update:all'](e) {
        if (!locks) {
          ctx.emit('props-change', e.model)
        }
      },
      ['cmfield:blur'](e) {
        // console.log('cmfield:blur', e)
        ctx.emit('form:input:blur', e)
      }
    })

    onMounted(function () {

      let loaded =  async function () {
        let res = await import('./ZProps/edtorConfig.js')
        let config = ZY.JSON5.parse(ZY.JSON5.stringify(res.default))
        let defObj = config.init.def.parts[0].def.properties.props
        // console.log(defObj)
        let _valueConfig = defObj.items.properties.value
        if (props.valueConfig) {
          _valueConfig = Object.assign(_valueConfig, props.valueConfig)
        }
        let _nameConfig = defObj.items.properties.name
        if (props.nameConfig) {
          _nameConfig = Object.assign(_nameConfig, props.nameConfig)
        }

        return {
          default: config
        }
      }
      page.commonLoadStep(
          loaded(),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              // console.log('formEditorConfig', cached)
              if (props.value) {
                setPartModel(config.name, 'form2', props.value)
              }
              locks = false
              // console.log('eventModel', config, page.defMap)
            }
          }
      )
    })

    return {
      EVENT_NAMES,
      page,
      store: page.store
    }

  }
}
</script>
