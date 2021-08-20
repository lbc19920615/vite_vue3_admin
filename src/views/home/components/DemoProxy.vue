<template>

</template>

<script setup>
// let o = {
//   name: "",
//   arr: [],
//   deepArr: {
//     name: 1
//   }
// }
let o = []
let p = new Proxy(o, {
  get(target, p, receiver) {
    console.log('get', target, p)
    return Reflect.get(target, p, receiver)
  },
  set(target, p, value, receiver) {
    console.log('proxy修改了', p, value)
    return Reflect.set(target, p, value, receiver)
  }
})

// p.name = "sdsds"
// p.arr.push(1)
// p.arr2 = [1]
p.push(1)
</script>
