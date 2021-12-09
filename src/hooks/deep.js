export function createDeepTraverl({handleProp} = {}) {
  let lodash = ZY.lodash;
  function travel(o = {}, {obj ={ }, path = [],  ext = {}} = {}) {
    if (o.type === 'object') {
      lodash.each(o.properties, function (item, key) {
        travel(item, {
          obj,
          path: path.concat(['properties', key]),
          ext,
        })
      })
    }
    else if (o.type === 'array') {

    }
    else {
      let s_path = ZY.getObjPathFromPathArr(path);
      // let pickedProp = lodash.pick(o, keys);
      // // console.log(s_path, o, keys, pickedProp)
      // lodash.set(obj, s_path, pickedProp)
      handleProp({obj, s_path, path, ext})
    }
  }

  function run(o = {}, ext = {}) {
    let obj = {}
    let path = []
    travel(o, {obj, path, ext});
    return obj;
  }
  return {
    run
  }
}
