# vite_vue3_admin

## 目录简介

1. [介绍](#介绍)
2. [业务开发](#业务开发)
    - [启动服务](#启动服务)
    - [编译](#编译)
3. [编译原理](#编译原理) 
    - [基础组件](#基础组件)
   
## <a name="介绍">介绍</a>
1. 提供一个给用户UI拖拽和配置 生成可以在vue2 小程序上跑的程序


![](docs/DC9F6C9A-BB7B-49cd-9A3D-F5FCCB1E06D9.png)

## <a name="业务开发">业务开发</a>
### <a name="启动服务">启动服务</a>

```bash
npm run gongsi
```

### <a name="编译">编译</a>
```bash
npm run build
```

## <a name="编译原理">编译原理</a>
### <a name="基础组件">基础组件</a>

1. CusInput 输入框
2. CusTextarea 多行文本
3. CusInputNumber 数字输入框
4. CusSelect 选择
5. CusRadio 单选
6. CusCheckbox 多选
7. CusSlider 滑块
8. CusRate 打分
9. CusTimePicker 时间选择
10. CusDateTimePicker 时间日期选择
11. CusCascader 级联选择
12. CusUploader 级联选择

### <a name="高级组件">高级组件</a>
1. CusRichText 富文本
2. CusAddress 地址选择

### <a name="编写组件">编写组件</a>

```vue
<template>
  <div class="z-dragxml-com"
       :class="zdrag__highlight()"
       @mouseenter.stop="zdrag__onMouseEnter">
<!--    {{form_config}}-->
    <z-cell-item v-bind="zdrag__form_config"
                 :label="zdrag__GET_CONFIG('ui.label', '')"
                 :desc="zdrag__GET_CONFIG('ui.desc', '')"
    >
    custom
    </z-cell-item>
  </div>
</template>

<script>
import {createZDragComponent} from "@/plugins/z-dragxml/factory";

export default createZDragComponent('ZDragCustom', {
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1639702173120" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2060" width="16" height="16"><path d="M811.008 335.872c-2.048-7.168-11.264-9.216-17.408-4.096L690.176 435.2c-8.192 8.192-20.48 8.192-28.672 0l-72.704-72.704c-8.192-8.192-8.192-20.48 0-28.672l104.448-104.448c5.12-5.12 3.072-14.336-4.096-17.408-17.408-4.096-35.84-7.168-54.272-7.168-108.544 0-195.584 94.208-183.296 204.8 2.048 17.408 6.144 32.768 12.288 48.128L225.28 697.344c-27.648 27.648-27.648 73.728 0 101.376 14.336 14.336 32.768 21.504 51.2 21.504s36.864-7.168 51.2-21.504l238.592-238.592c15.36 6.144 31.744 10.24 48.128 12.288 111.616 12.288 204.8-74.752 204.8-183.296 0-18.432-3.072-36.864-8.192-53.248z" p-id="2061"></path></svg>
<div class="z-dragxml-label__name">自定义</div>
</div>`
  },
  INIT_CONFIG: {
    type: 'string'
  }
})
</script>
```
