\<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    CusOneOrMany-->
    {{state.items}}
    <div>
      <el-row align="middle" v-for="(item, index) in state.items" :key="index">
        <el-col :span="18">
          <template v-if="widgetConfig.type === 'number'">
            <el-input @change="onChange" v-model.number="item.value" type="number" />
          </template>
          <template v-else>
            <el-input @change="onChange" v-model="item.value" />
          </template>
        </el-col>
        <el-col :span="6">
          <el-button type="danger" size="small"
                     @click="removeItem(index)">delete</el-button>
        </el-col>
      </el-row>
      <el-button size="small" @click="appendItem">appendItem</el-button>
    </div>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";

export default {
  name: 'CusOneOrMany',
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        // console.log(newVal)
        if (typeof newVal !== undefined) {
          if (Array.isArray(newVal)) {
            state.items = newVal.map(v => {
              return {
                value: v
              }
            })
          } else {
            state.items = [
              {
                value: newVal
              }
            ]
          }
        }
      }
    })
    let state = data({
      items: []
    })
    init(props)

    function appendItem() {
      state.items.push({
        value: null
      })
    }

    function removeItem(index) {
      state.items.splice(index, 1)
    }

    function onChange() {
      let ret = null
      let v = state.items.map(v => v.value).filter(v => {
        return v !== null
      })
      if (v.length < 2) {
        ret = v[0]
      } else {
        ret = v
      }
      methods.on_change(ret)
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      removeItem,
      appendItem,
      onChange,
      methods,
      listeners,
    }
  },
}
</script>

