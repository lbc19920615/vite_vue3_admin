
/**
 * defineAutoStoreControl
 * @param config
 * @returns {{}}
 */
export function defineAutoStoreControl(config = { data: {}, computed: {}, globalStore, rootStore}) {

  let templateFun = ''
  for (let funName in globalThis.ZY.lodash) {
    templateFun = templateFun + `
        function ${funName}(...args) {
          return ZY.lodash.${funName}(...args)
        }
      `
  }

  let commonFun = `
  ${templateFun}

  function ZY_hour_between_2_date(date1, date2) {
    if (date1 && date2) {
      return ZY.Time.subtract2Date(date1, date2).asHours()
    }
    return null
  }

  function ZY_floor(v, presion) {
    let ret = floor(v, presion)
    if (ret === 0) {
      return ''
    }
    return ret
  }
  
  function ZY_NOT(v) {
    return !v
  }

  function ZY_LENGTH(v) {
    if (v && v.length) {
      return v.length
    }
    return 0
  }
  
  function ZY_ARRAY_EMPTY(v) {
    // return lt(ZY_LENGTH(keys(v)), 1)
    return isEmpty(v)
  }
  
  function ZY_ARRAY_NOT_EMPTY(v) {
    // return gt(ZY_LENGTH(keys(v)), 0)
     return !isEmpty(v)
  }

  function LENGTH(v) {
    if (v && v.length) {
      return v.length
    }
    return -1
  }
  function VAL(v, defaultVal) {
    return ZY.lodash.get($root, v, defaultVal)
  }
`


  let rootStore = config.rootStore ?? null
  let globalStore = config.globalStore ?? null

  let ret = {
  }
  let computed = {}
  for (let key in config.computed) {
    computed[key] = new Function('model', 'options', `
        ${commonFun}
        let context = options.context ? options.context : {}
        
        function MODEL(v, defaultVal) {
          return ZY.lodash.get(model, v, defaultVal)
        }
        
        // console.log('context', context)
        
        function CONST(v, defaultVal) {
          return ZY.lodash.get(context.config.constants, v, defaultVal)
        }
        
        function ROOT_STATE(v, defaultVal) {
        console.log('ROOT_STATE', v)
          return ZY.lodash.get(context.rootStore.state, v, defaultVal)
        }
        
        return () => {
          // console.log('computed ${key} build', options)
          options.beforeBuild('${key}')
          return ${config.computed[key]}
        }
      `)
  }

  const dataDef = config.data

  const obj = ZY.formModel.createFormModel(dataDef);

  let computedLinks = {
  }

  function formDefTravase(formDef = {}, computedLinks) {
    if (formDef.type === 'object') {
      Object.entries(formDef.properties)
        .forEach(([ key, formDefProp ]) => {
          if (formDefProp.type !== 'array') {
            if (formDefProp.computedProp) {
              const linked = formDefProp.computedProp
              if (!computedLinks[linked]) {
                computedLinks[linked] = []
              }
              computedLinks[linked].push({
                key
              })
            }
          } else {
            formDefTravase(formDefProp.items, computedLinks);
          }
        });
    }
  }

  formDefTravase(dataDef, computedLinks);


  // console.log('obj', obj)
  // console.log(config, globalStore.serviceNames)

  let model = null
  ret = globalStore.run(config.service, 'initModel', {
    plain: obj,
    computed,
    callback: {
      onComputedChange(key, newVal) {
        // console.log('onComputedChange', key, newVal)
        if (ret.beforeAutoVal) {
          ret.beforeAutoVal(key, newVal)
        }
        let findKeys = computedLinks[key]
        if (Array.isArray(findKeys)) {
          findKeys.forEach(findKeyItem => {
            ZY.comHelper.autoVal({
              obj: model,
              key: findKeyItem.key,
              base: model,
              computedVal() {
                return newVal
              }
            })
          })
        }
      }
    },
    context: {
      config,
      rootStore
    }
  })
  model = ret.model

  function set(def) {
    globalStore.run(config.service, 'setModel', def)
  }

  function _dxValue(v) {
    let fun = new Function('valueTemplate', '$root', `
        ${commonFun}

        function MODEL(v, defaultVal) {
          return ZY.lodash.get($root.model, v, defaultVal)
        }
        return eval(valueTemplate)
      `)
    return fun(v, ret)
  }

  /**
   * 模板filter
   * @param valueTemplateName
   * @returns {*}
   */
  function filter(valueTemplateName) {
    if (!config.filters || !config.filters[valueTemplateName]) {
      throw new Error('no valueTemplateName')
    }
    return _dxValue(config.filters[valueTemplateName])
  }


  return {
    dxValue: _dxValue,
    store: ret,
    set,
    filter,
  }
}
