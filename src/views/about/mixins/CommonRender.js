function stylesToObjStyle(o = []) {
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
      if (o && k === 'styles') {
        return stylesToObjStyle(o)
      }
    }
  }
}
