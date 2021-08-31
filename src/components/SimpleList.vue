<template>
  <div>
<!--    {{state}}-->
    <el-input v-model="state.search"></el-input>
    <el-table :data="search(state.suggest, state.search)">
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
import { reactive } from 'vue'
import {useArrHandler} from "@/views/home/hooks";

export default {
  name: 'SimpleList',
  props: {
    suggest: Array
  },
  setup(props, ctx) {
    console.log(props)
    let state = reactive({
      suggest: props.suggest,
      search: ''
    })


    let handler = useArrHandler(state.suggest)

    function search(options, v) {
      let arr = handler.search(
          function(o) {
            return o.value.includes(v);
          }
      ) ?? []
      return arr
    }
    function select(scope) {
      state.value = scope.row.value
      ctx.emit('select-item', state.value)
    }

    return {
      search,
      state,
      select
    }
  }
}
</script>
