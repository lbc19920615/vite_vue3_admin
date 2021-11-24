<template>
  <div class="z-style-editor">
<!--    {{value}}-->
    <CodeMirror
        ref="editorRef"
        v-model="content"
        @update:modelValue="editorChange"
        :height="styleObj.height"
        :mode="mode"
        theme="monokai"
    />
<!--    {{styleModel}}-->
    <el-form v-model="styleModel">
      <el-form-item label="类型" >
        <el-select v-model="currentType"
                   @change="onTypeChange">
          <el-option
              v-for="(option, index) in keys"
              :label="option"
              :value="option"
          />
        </el-select>
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
      <el-form-item label="背景色" >
        <el-color-picker v-model="styleModel.backgroundColor"
                  @change="onChange(['backgroundColor'],$event)"
                  clearable
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="other" >
        <el-input v-model="styleModel.other"
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
export default {
  name: 'ZStyleEditor',
  components: {UnitInput},
  props: {
    value: String
  },
  data() {
    return {
      lock: new ZY.Lock(),
      mode: 'text/css',
      content: '',
      styleObj: {
      },
      styleModel: {
      },
      cached: {},
      currentType: ':host',
      keys: [
          ':host',
          ':host:hover',
          ':host:active',
      ]
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
        if (key !== this.keys[0] && c) {
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
        this.cached[key] = cached[key] ?? {}
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
