import {renderForm} from "@/utils/tpllib";

export function initCompile() {
  fetch(globalThis.serverRes.template)
    .then(res => {
    return res.text()
  }).then((str) => {
    let tpl = document.createElement('script');
    tpl.id="tpl_comformscr2";
    tpl.type = 'template';
    tpl.innerHTML = str
    document.body.append(tpl)
  })

  /**
   *
   * @param compileData
   * @param CONFIG
   * @param tplDom
   * @param args
   * @returns {*}
   */
   return function ({
                                         compileData = {},
                                         CONFIG = {},
                                         tplDom = document.getElementById( 'tpl_comformscr2'),
                                       } = {}, args) {
    let JSON5 = ZY.JSON5;
    if (!compileData) {
      compileData = {}
    }
    compileData.APP_CONFIG = {
      server_origin: location.origin
    }
    compileData.CONFIG = CONFIG
    compileData.CONFIG_SOURCE_JSON5 = JSON5.stringify(CONFIG)


    function BASE_renderForm(config, basePath, configPath, append) {
      // append.BASE_PATH = basePath;
      return renderForm(config, basePath, configPath, append);
    }


    function renderCOM(formCONFIG) {
      let partStr = {};
      if (Array.isArray(formCONFIG.parts)) {
        formCONFIG.parts.forEach((part, index) => {
          // console.dir(part.def, {
          //   depth: null
          // });
          const modelKey = 'parts.' + part.name + '.model';
          const partConfigKey = 'config.parts[' + index + '].def';

          partStr[part.name]  = BASE_renderForm(part.def, modelKey, partConfigKey,
            { part, BASE_PATH: modelKey, CONFIG, partKey: `parts.${part.name}` })
        })
      }
      return partStr
    }


    compileData.partStr = renderCOM(CONFIG)

    // console.log(compileData)
    let tpl = tplDom.innerHTML
    let t = Twig.twig({
      // id: tplID,
      data: tpl,
      allowInlineIncludes: true
    });
    let html = t.render(compileData)
    return html
  }

}
