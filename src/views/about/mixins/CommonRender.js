function stylesToObjStyle(o = []) {
  return Object.fromEntries(o)
}

function attrsToObjAttr(o = []) {
  return Object.fromEntries(o)
}

export let commonRenderMixin = {
  props: {
    attrs: null
  },
  data() {
    return {
    }
  },
  methods: {
    getAttrs(k) {
      let o = null
      if (this.attrs[k]) {
        o = this.attrs[k]
      }
      if (o) {
        if (k === 'styles') {
          return stylesToObjStyle(o)
        }
        if (k === 'attrs') {
          // console.log(typeof o)

          return attrsToObjAttr(ZY.JSON5.parse(o))
        }
      }
    }
  }
}
