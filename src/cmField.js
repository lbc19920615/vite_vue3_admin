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
    // console.log(import.meta.env.VITE_REMOTE_LIB_ORIGIN)
    import(import.meta.env.VITE_REMOTE_LIB_ORIGIN + '/public/cmField.js?v=' + Date.now())
      .then(res => {
      // console.log(res)
      if (res.default) {
        resolve( res.default('CmField', html) )
      }
    })
  })
}