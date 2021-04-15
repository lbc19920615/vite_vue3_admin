import SvgIcon from '@/components/SvgIcon/index.vue'// svg组件
import './iconfont'

export default {
  install(app) {
    app.component('svg-icon', SvgIcon)
  }
}
