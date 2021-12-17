
export const baseServiceMixin = {
  data() {
    return {
      base: '',
    };
  },
};

export const baseServiceDef = ({ vue, props, config }) => {
  const { onMounted, reactive, effectScope, computed, watchEffect, ref, inject, nextTick, getCurrentInstance } = vue;

  const ctx = getCurrentInstance().ctx;

  const scope = effectScope();
  const globalStore = inject('globalStore');

  let modeljson = ref('')

  let ret = {};
  let model = {};
  const computedModel = {};

  function getModel() {
    return {
      model,
      computedModel,
    };
  }

  function initModel(modelDef = { plain: {}, computed: {}, callback: {}, context: {} }) {
    // scope.run(() => {
    //
    // });

    model = reactive(modelDef.plain);

    for (const computedKey in modelDef.computed) {
      const fun = modelDef.computed[computedKey](model, {
        beforeBuild(key) {
          // console.log('beforeBuild', key, computedModel[key].value);
          const preValue = computedModel[key].value;
          nextTick(() => {
            // console.log('beforeBuild', key, computedModel[key].value);
            const nextValue = computedModel[key].value;
            if (modelDef.callback && modelDef.callback.onComputedChange) {
              modelDef.callback.onComputedChange(key, nextValue, preValue);
            }
          });
        },
        context: modelDef.context,
      });
      computedModel[computedKey] = computed(fun);
    }


    // watch(() => model.name, () => console.log(model, computedModel));
    // global.ZY.PubSub.publish(globalStore.EVENT_TYPES.INIT_MODEL_READY, '');
    ctx.RefsManager.emit(globalStore.EVENT_TYPES.INIT_MODEL_READY, { ctx });

    return getModel();
  }

  async function setModel(newVal) {
    // console.log(ZY.lodash.get(model, path));
    // console.log('setModel', newVal)
    for (const key in newVal) {
      model[key] = newVal[key];
    }
    modeljson.value = ZY.JSON5.stringify(model)
    // global.ZY.PubSub.publish(globalStore.EVENT_TYPES.SET_MODEL_READY, '');
    ctx.RefsManager.emit(globalStore.EVENT_TYPES.SET_MODEL_READY, { ctx, model });
  }

  watchEffect(() => {
    // console.log('watchEffect', ctx)
    if (globalStore.onWatchEffect) {
      globalStore.onWatchEffect({
        ctx,
        config,
        props,
      });
    }
  });

  ret = {
    model,
    computedModel,
    config,
    modeljson,
    initModel,
    getModel,
    setModel,
  };

  return ret;
};
