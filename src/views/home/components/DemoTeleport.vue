<template>
  <el-button type="primary" @click="isShow = true">insert to out div</el-button>
  <teleport to="#endofbody">
    <div id="content" v-show="isShow" @click="handleClick">
      <p>
        this will be moved to #endofbody.<br />
        Pretend that it's a modal
      </p>
    </div>
  </teleport>
</template>

<script setup>
import {ref} from "vue";

let isShow = ref(false)

function handleClick() {
  alert('handleClick')
}
</script>
