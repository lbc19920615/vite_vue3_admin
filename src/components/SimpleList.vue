<template>
  <div>
<!--    {{state}}-->
    <el-input v-model="state.search"></el-input>
    <el-table :data="dataTable">
      <el-table-column  prop="label" label="LABEL"></el-table-column>
      <el-table-column  prop="value" label="VALUE"></el-table-column>
      <el-table-column  label="ACTION">
        <template v-slot:default="scope">
          <el-button size="small" @click="select(scope)">选中</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {computed, reactive, toRaw, watch} from 'vue'
import {useArrHandler} from "@/views/home/hooks";

export default {
  name: 'SimpleList',
  props: {
    suggest: Array
  },
  setup(props, ctx) {
    // console.log(props)
    let state = reactive({
      suggest: props.suggest ?? [],
      search: ''
    })

    let handler = useArrHandler(state,'suggest')

    function search(options = [], v) {
      return handler.search(
          function (o) {
            return o.value.includes(v) || o.label.includes(v)
          }
      ) ?? []
    }

    let  dataTable = computed(() => {
      // console.log(state.suggest)
      return search(state.suggest, state.search) ?? []
    })

    function select(scope) {
      state.value = scope.row.value
      ctx.emit('select-item', state.value)
    }

    watch(() => props.suggest, (newval) => {
      // console.log('sdsdsdsdsdsds', toRaw(newval))
      state.suggest = toRaw(newval)
    }, {
      immediate: true
    })

    return {
      dataTable,
      search,
      state,
      select
    }
  }
}
</script>
