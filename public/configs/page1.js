export default {
  def: {
    constants: {},
//     layoutSlots: `
//     <template #form_after="scope">
//       <CusSubmitButton
//           :scope="scope"
//           class="el-col z-submit-btn"></CusSubmitButton>
//     </template>
// `,
//     beforeScript: `
//          let properties =  {
//             editor_step: {
//               type: String,
//             },
//             code_str: {
//               type: String,
//             },
//             textarea_step: {
//               type: String
//             }
//           }
//       `,
//     onInited: `
// <script>
//     renderC.detectLayout()
//     renderC.detectEvent((events, {currentData} = {}) => {
//       工具.初始化(currentData);
//       工具.设置步骤();
//     })
// </script>
//       `.replace('<script>', '').replace('</script>', '')
//   },
  },
  args: {
    src: 'zpage.twig'
  },
}
