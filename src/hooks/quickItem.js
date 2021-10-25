export function buildQuickItem({type = 'string', ui = {}} = {}) {
  return {
    type,
    ui:{
      type:'',label:'',widgetConfig:'{}',form_item:{},attrs:[],
      ...ui
    },
    rules:'[]',
    rulesArr:[]
  }
}

export function buildQuickWidget2({widget = '', widgetConfig = {}} = {}) {
  return {
    data:{
      widget:widget,
      widgetConfig:widgetConfig
    }
  }
}
