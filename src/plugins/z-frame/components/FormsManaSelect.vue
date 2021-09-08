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
import {reactive, onMounted, resolveComponent} from 'vue';
import {FormsMana, useFormsMana} from "@/plugins/z-frame/formsMana";
import {useRefsManager} from "@/hooks/ref";
export default {
  name: "FormsManaSelect",
  components: {},
  props: {
    comName: String
  },
  setup(props, ctx) {
    let uuid = props.comName ?? 'form_mana_' + ZY.rid()
    let formMana = useFormsMana()
    let state = reactive({
      suggest: [],
      column: [
        {
           prop: 'label',
           width: '150px'
        },
        {
          prop: 'sdsds',
          width: '150px',
          label: 'NAME',
          render(h, props) {
            const scope = props.scope
            let value = ZY.JSON5.parse( scope.row['value'])
            return h('div', {

            }, value.name ?? '')
          }
        },
        {
          prop: 'value',
          label: 'VALUE',
          render(h, props) {
            const jsonviewer = resolveComponent('json-viewer')
            const scope = props.scope
            // console.log(jsonviewer, props)
            let value = ZY.JSON5.parse( scope.row[scope.column.property])
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
      e.label = e.label + '___' + ZY.rid(3)
      // console.log('select', e)
      ctx.emit('select-form', e)
    }
    async function load() {
      await formMana.init();
      await ZY.sleep(30)
      state.suggest = formMana.getOptions()
    }
    async function loadFile() {
      await formMana.loadFile();
      await load()
    }
    async function exportFile() {
      await FormsMana.saveCache2File(
          FormsMana.getOptions()
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
