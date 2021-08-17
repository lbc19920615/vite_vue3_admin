<style>
.todo--done {
  text-decoration: line-through;
}
</style>

<template>
  <div>
<!--    <el-button type="primary" @click="handleSearch">search</el-button>-->
    <input type="text" v-model="val" @keyup.enter="addTodo">
    <ul>
      <li v-for="(todo, index) in todos"
          :key="todo.id"
          :class="{'todo--done': todo.done}"
      >
        <header>{{todo.title}} </header>
<!--        <el-row type="flex">-->
<!--          <header>{{todo.title}} </header>-->
<!--          <button v-if="!todo.done" @click="doneTodo(index)">结束</button>-->
<!--        </el-row>-->
      </li>
    </ul>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import {storeVar, useArrHandler} from "@/views/home/hooks";


let val = ref('')
let todos = reactive([
])



function addTodo(){
  todos.push({
    id:todos.length,
    title:val.value,
    done:false
  })
  val.value = ''
}

//  deleteTodo
// restore
storeVar(todos, 'app:todos')

let handler = useArrHandler(todos)

function doneTodo(index) {
  handler.update(index, {
    done: true
  })
}

function handleSearch() {
  console.log('handleSearch')
  //
  // console.log(handler.search(['done', false]))
}
</script>
