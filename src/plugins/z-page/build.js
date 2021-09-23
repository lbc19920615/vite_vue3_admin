/**
 *
 * @param model
 * @param name
 * @param args
 * @returns {string}
 */
export let buildFormDep = function (model = {parts: []}, name = model.name, args = {}) {
  let JSON5 = ZY.JSON5;
  let parsedParts = []
  let defaultVals = {}
  let parts = model.parts
  // console.log(model)
  parts.forEach(part => {
    if (part.name && part.type) {
      try {
        let ui = JSON5.parse(part.ui)
        let partProps = JSON5.parse(part.properties)
        // let computed = JSON5.parse(part.computed)
        let computed = {}
        if (part.computed) {
         try {
           computed = JSON5.parse(part.computed)
         } catch (e) {}
        }
        console.log('computed', computed)
        let properties = partProps.properties

        let obj = {
          type: part.type,
          name: part.name,
          serviceTpl: {
            def: {},
            args: {
              src: 'bservice.twig',
            },
          },
          def: {
            type: 'object',
            ui,
            properties,
          },
          computed: computed,
        }
        defaultVals[obj.name] = JSON5.parse(part.defaultVal)
        parsedParts.push(obj)
      } catch (e) {
        console.log(e)
      }
    }
  })
  // console.log(parsedParts)
  let obj = {
    name: name ?? 'process-step1',
    defaultVal: defaultVals,
    init: {
      def: {
        constants: {},
        parts: parsedParts,
      },
      args
    }
  }
  // console.log(obj)
  return obj
}
