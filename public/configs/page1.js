export default {
  def: {
    constants: {},
    layoutSlots: `
    <template #form_after="scope">
      <CusSubmitButton
          :scope="scope"
          class="el-col z-submit-btn"></CusSubmitButton>
    </template>
`,
    beforeScript: `
         let properties =  {
            editor_step: {
              type: String,
            },
            code_str: {
              type: String,
            },
            textarea_step: {
              type: String
            }
          }      
      `,
    onInited: `
<script>    
     storeControl.set({
        textarea_step: 'sdsds'
    })
    renderC.detectLayout()  
    renderC.detectEvent((events, {currentData} = {}) => {
      let obj = {}
      events.forEach(event => {
        obj[event.name] = new Function('e', event.code)
      })
      // console.log('setEvent', obj)
       page.setEventHandler(obj)
       let forms = currentData.forms
       forms.forEach(form => {
         let {value, name} = form
         let obj = ZY.JSON5.parse(value)
         let formDef = buildFormDep(obj, name)
         console.log(formDef.init.def.parts[0])
         setDefMap(formDef, name)
       })
       // console.log(forms)
       // setDefMap(pag)
    })      
</script>
      `.replace('<script>', '').replace('</script>', '')
  },
  args: {
    src: 'zpage.twig'
  },
}
