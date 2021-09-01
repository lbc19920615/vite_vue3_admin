/**
 *
 * @param model
 * @param name
 * @returns {string}
 */
export let buildFormDep = function (model = {parts: []}, name = model.name) {
  let JSON5 = ZY.JSON5;
  let parsedParts = []
  let defaultVals = {}
  let parts = model.parts
  parts.forEach(part => {
    if (part.name && part.type) {
      try {
        let ui = JSON5.parse(part.ui)
        let properties = JSON5.parse(part.properties).properties
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
          computed: {
          },
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
        parts: parsedParts
      },
      args: {
        src: 'comformscr2.twig'
      }
    }
  }
  // console.log(obj)
  return obj
}
