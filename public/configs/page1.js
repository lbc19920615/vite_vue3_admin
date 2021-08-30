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
    renderC.detectEvent((events) => {
      let obj = {}
      events.forEach(event => {
        obj[event.name] = new Function('e', event.code)
      })
      console.log('setEvent', obj)
       page.setEventHandler(obj)
    })      
</script>
      `.replace('<script>', '').replace('</script>', '')
  },
  args: {
    src: 'zpage.twig'
  },
}
