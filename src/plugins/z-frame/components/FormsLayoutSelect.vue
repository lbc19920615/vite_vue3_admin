<template>
<!--  {{state}}-->
  <el-space style="margin-bottom: var(--z-size-20);" >
    <el-button type="primary" @click="loadFile">加载</el-button>
    <el-button type="primary" @click="exportFile">保存到本地</el-button>
  </el-space>
  <simple-list
      :suggest="state.suggest"
      :column="state.column"
      @select="onSelect"
  ></simple-list>
</template>

<script>
import {reactive, resolveComponent} from 'vue';
import {useRefsManager} from "@/hooks/ref";
import {FormsLayout} from "@/plugins/z-frame/formsLayout";
export default {
  name: "FormsLayoutSelect",
  components: {},
  props: {
    comName: String
  },
  setup(props, ctx) {
    let uuid = props.comName ?? 'form_layout_' + ZY.rid()
    let formMana = FormsLayout
    let state = reactive({
      suggest: [],
      column: [
        {
           prop: 'label',
           width: '150px'
        },
        {
          prop: 'value',
          label: 'VALUE',
          render(h, props) {
            const jsonviewer = resolveComponent('v-json-viewer')
            const scope = props.scope
            // console.log(jsonviewer, props)
            let value = scope.row.value
            let jsondom = h(jsonviewer, {
              value: value,
              expanded: true,
              copyable: true,
            })
            return h('div', {
              style: {
                overflow: 'auto',
                maxHeight: '350px',
              }
            }, [jsondom])
          }
        }
      ]
    })
    // onMounted(async () => {
    //   await formMana.init();
    //   await ZY.sleep(30)
    //   state.suggest = formMana.getOptions()
    // })
    function onSelect(e) {
      // e.label = e.label + '___' + ZY.rid(3)
      // console.log('select', e)
      let clonedObj = ZY.JSON5.parse(ZY.JSON5.stringify(e.value))
      ctx.emit('select-form', clonedObj)
    }
    async function load() {
      await formMana.init();
      await ZY.sleep(30)
      state.suggest = formMana.getOptions()
      // let options  = formMana.getOptions()
      // console.log(options)
    }
    async function loadFile() {
      await formMana.loadFile();
      await load()
    }
    async function exportFile() {
      await formMana.saveCache2File(
          formMana.getOptions()
      )
    }
    let ret = {
      uuid,
      state,
      exportFile,
      loadFile,
      onSelect,
      load,
    }
    useRefsManager(ret, [
        async function (def) {
      // console.log('sdsdsds', def)

        }
    ])
    return ret
  }
}
</script>

<style scoped>

</style>
