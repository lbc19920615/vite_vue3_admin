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
   storeControl.set({
      textarea_step: 'sdsds'
  })
  renderC.detect()      
      `
  },
  args: {
    src: 'zpage.twig'
  },
}
