export function initCmField() {
  // function getHereDoc(fn) {
  //   return fn.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
  // }
  return new Promise(resolve => {
    let cmFieldTwig =  document.getElementById('cmFieldTpl').innerHTML;
    let t = Twig.twig({
      // id: tplID,
      data: cmFieldTwig,
      allowInlineIncludes: true
    });
    let html = t.render({})
    // console.log(html)
    /* @vite-ignore */
    import('@/components/CmField/cmField.js')
      .then(res => {
        // console.log(res)
        if (res.default) {
          resolve( res.default('CmField', html) )
        }
      })
  })
}
