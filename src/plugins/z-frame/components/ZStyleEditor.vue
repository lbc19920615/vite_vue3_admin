<style lang="scss">
.z-style-editor {
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__content {
    line-height: 1;
  }
}
</style>

<template>
  <div class="z-style-editor">
<!--    {{value}}-->
<!--   <z-easy-popover :model-attr="{width: '300px', placement: 'left', appendToBoby: true}">-->

<!--   </z-easy-popover>-->
    <z-easy-hide title="源码"
                 :button-attr="{size: 'small'}"
    class="a-space-mb-10"
    >
      <CodeMirror
          ref="editorRef"
          v-model="content"
          @update:modelValue="editorChange"
          :height="styleObj.height"
          :mode="mode"
          theme="monokai"
      />
    </z-easy-hide>
<!--    {{styleModel}}-->
    <el-form v-model="styleModel">
      <el-form-item label="类型" >
        <el-select v-model="currentType"
                   @change="onTypeChange">
          <el-option
              v-for="(option, index) in keys"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="背景色" >
        <el-color-picker v-model="styleModel.backgroundColor"
                  @change="onChange(['backgroundColor'],$event)"
                  clearable
                         show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="颜色" >
        <el-color-picker v-model="styleModel.color"
                         @change="onChange(['color'],$event)"
                         clearable
                         show-alpha
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="宽度" >
        <unit-input v-model="styleModel.width"
                    default-unit="px"
                    @change="onChange(['width'],$event)"></unit-input>
      </el-form-item>
      <el-form-item label="高度" >
        <unit-input v-model="styleModel.height"
                    default-unit="px"
                    @change="onChange(['height'],$event)"></unit-input>
      </el-form-item>
      <div class="a-space-mb-10">
        <el-collapse v-model="activeNames" >
          <el-collapse-item title="margin" name="1">
            <el-form-item label="marginLeft" >
              <unit-input v-model="styleModel.marginLeft"
                          default-unit="px"
                          @change="onChange(['marginLeft'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="marginTop" >
              <unit-input v-model="styleModel.marginTop"
                          default-unit="px"
                          @change="onChange(['marginTop'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="marginBottom" >
              <unit-input v-model="styleModel.marginBottom"
                          default-unit="px"
                          @change="onChange(['marginBottom'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="marginRight" >
              <unit-input v-model="styleModel.marginRight"
                          default-unit="px"
                          @change="onChange(['marginRight'],$event)"></unit-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="padding" name="2">
            <el-form-item label="paddingLeft" >
              <unit-input v-model="styleModel.paddingLeft"
                          default-unit="px"
                          @change="onChange(['paddingLeft'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="paddingTop" >
              <unit-input v-model="styleModel.paddingTop"
                          default-unit="px"
                          @change="onChange(['paddingTop'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="paddingBottom" >
              <unit-input v-model="styleModel.paddingBottom"
                          default-unit="px"
                          @change="onChange(['paddingBottom'],$event)"></unit-input>
            </el-form-item>
            <el-form-item label="paddingRight" >
              <unit-input v-model="styleModel.paddingRight"
                          default-unit="px"
                          @change="onChange(['paddingRight'],$event)"></unit-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-form-item label="overflow" >
        <el-input v-model="styleModel.overflow"
                  @change="onChange(['overflow'],$event)"
                  clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="other" >
        <el-input type="textarea" v-model="styleModel.other"
                  @change="onChange(['other'],$event)"
                  clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UnitInput from "@/components/UnitInput.vue";
import {toRaw} from "vue";
import ZEasyPopover from "@/plugins/z-frame/ZEasyPopover.vue";
import ZEasyHide from "@/plugins/z-frame/components/ZEasyHide.vue";
import CodeMirror from "@/plugins/CodeMirrorEditor/CodeMirror.vue";
export default {
  name: 'ZStyleEditor',
  components: {CodeMirror, ZEasyHide, ZEasyPopover, UnitInput},
  props: {
    // "{cached: null, css: ''}"
    value: String,
    extKeys: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    let keys =  [
      ':host',
      ':host(:hover) ',
      ':host(:active) ',
    ].map(v => {
      return {
        label: v,
        value: v,
      }
    }).concat(this.extKeys)
    return {
      lock: new ZY.Lock(),
      mode: 'text/css',
      content: '',
      styleObj: {
      },
      styleModel: {
      },
      cached: {},
      currentType: keys[0].value,
      keys: keys,
      activeNames: []
    }
  },
  watch: {
    value(newVal) {
      // console.log('sdsds', newVal)
      this.init(newVal)
    }
  },
  methods: {
    editorChange: function (e) {
      // console.log('editorChange', e)
      this.lock.lock( () => {
        // this.$emit('update:modelValue', e)
        this.$emit('val:change',
            ZY.JSON5.stringify({
              cached: toRaw(this.cached),
              css: e
            })
        );
      }, 1000)
    },
    changeModel(type = this.currentType) {
      this.styleModel = this.cached[type]
    },
    setContent(v) {
      this.content = v
      this.$refs.editorRef.setModel( v )
    },
    onChange(pathArr = [], e) {
      let path =
          ZY.getObjPathFromPathArr(pathArr)
      // console.log(path, e)
      ZY.lodash.set(this.styleModel, path, e)
      this.$nextTick(() => {
        this.setContent(this.buildStyleContent())
      })
    },
    buildStyleItem(style, key) {
      // console.log(style, key)
      let keys = Object.keys(style)
      // let value = JSON.stringify(style, null ,2).replaceAll(/"/g, '')
      let props = Object.entries(style).map(([k, v]) => {
        if (!v) {
          return '';
        }
        let propKey = ZY.camel2hyphen(k)
        return ` ${propKey}: ${v};`
      })
      let value = props.filter(v => v).join('\n');
      if (keys.length > 0) {
        return `${key} {
${value}
}`
      }
      return ''
    },
    buildStyleContent() {
      let content = ''
      ZY.lodash.each(this.cached, (style, key) => {
        let c = this.buildStyleItem(style, key)
        if (key !== this.keys[0].value && c) {
          content = content + '\n'
        }
        content = content + c
      })
      // console.log(content)
      return content
    },
    onTypeChange(v) {
      // console.log(this.styleModel, v)
      this.changeModel(v)
    },
    init(newVal = this.value) {
      let cached = {}
      if (newVal) {
        try {
          let obj = ZY.JSON5.parse(newVal);
          cached = obj?.cached ?? {}
          // console.log(cached)
          if (obj.css) {
            this.lock.lock( () => {
              this.setContent(obj.css)
            }, 1000)
          }
        } catch (e) {}
      }
      this.keys.forEach(key => {
        this.cached[key.value] = cached[key.value] ?? {}
      })
      // console.log(this.value)
      this.changeModel()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
