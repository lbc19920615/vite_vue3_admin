<template>
  <div class="z-dragxml-com"
       :class="zdrag__highlight()"
       @mouseenter.stop="zdrag__onMouseEnter">
<!--    {{form_config}}-->
    <z-cell-item v-bind="zdrag__form_config"
                 :label="zdrag__GET_CONFIG('ui.label', '')"
                 :desc="zdrag__GET_CONFIG('ui.desc', '')"
    >
    {{zdrag__GET_CONFIG('ui.cusWidget', '')}}
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
  },
  DRAG_EXPORT() {
    return {
      ui: {
        custom: true,
      }
    }
  },
  DRAG_UI_CONFIG() {
    return {
      cusWidget: {
        type: 'string',
        ui: {
          label: '自定义'
        }
      }
    }
  }
})
</script>
