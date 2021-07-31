<style lang="scss" scoped>
$cls: "async-form";
#{$cls}{
}
</style>

<template>
  <div class="async-form">
    <component :is="comName"></component>
  </div>
</template>

<script>
import { fetchContentV3,  } from '@expose/main.js'
import { parseComponent } from 'vue-sfc-parser'

export default {
  name: "AsyncForm",
  mixins: [
  ],
  components: {},
  data() {
    return {
      formDef: {},
      comName: ''
    }
  },
  props: {
    json: {
      type: String,
      default: '{}'
    },
    template: String
  },
  watch: {
    json: {
      handler(newVal) {
        console.log('json changes', newVal)
        try {
          this.formDef = JSON.parse(newVal)
        } catch (e) {
          this.formDef = {}
        }
        this.fetch()
      },
      immediate: true
    }
  },
  methods: {
    async fetch() {
      let self = this
      try {
        // console.log('this.formDef', this.formDef)
        let tpl = await fetchContentV3(this.formDef, {
          src: this.template
        })
        let comName = 'test-' + Date.now()
        let sfc = parseComponent(tpl)
        const templateId = comName + '-tpl';
// eslint-disable-next-line no-undef
        globalThis.initTemplate(templateId, globalThis, {
          html: sfc.template.content,
        });
        console.log(sfc.template.content)

        const objectURL = URL.createObjectURL(
            new Blob([sfc.script.content],
                { type: 'text/javascript' })
        );
        globalThis.importScripts(objectURL).then(res => {
          globalThis.app.component(comName, {
            template: '#' + templateId,
            ...res.default
          })
          setTimeout(() => {
            self.comName = comName
          }, 300)
        })

        // globalThis.app.component(comName, {
        //   template: tpl,
        //   data() {
        //     return {
        //       model: {
        //       }
        //     }
        //   }
        // })
        // this.comName = comName
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
