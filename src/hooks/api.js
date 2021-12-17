/**
 * 使用api
 */
export function useToolApi() {
  let lodash = ZY.lodash;

  function travel(o = {}, {obj ={ }, path = [],  keys = []} = {}) {
    if (o.type === 'object') {
      lodash.each(o.properties, function (item, key) {
        travel(item, {
          obj,
          path: path.concat(['properties', key]),
          keys,
        })
      })
    }
    else if (o.type === 'array') {

    }
    else {
      let s_path = ZY.getObjPathFromPathArr(path);
      let pickedProp = lodash.pick(o, keys);
      // console.log(s_path, o, keys, pickedProp)
      lodash.set(obj, s_path, pickedProp)
    }
  }

  function purfyObj(o = {}, keys = []) {
    let obj = {}
    let path = []
    travel(o, {obj, path, keys});
    return obj;
  }

  /**
   * saveJson 创建表
   * @param serverProps {string}
   * @param fileName {string}
   * @param newProps {{}}
   * @param oldProps {{}}
   * @param tableName {string}
   * @param headers {{}}
   * @param data {{}}
   * @returns {Promise<*>}
   */
  async function saveJson(serverProps = '', fileName = '',
                          {headers = {}, newProps = {}, oldProps = {}, tableName = '',  data = {}} = {} ) {

    const PICKED_PROPS = ['type', 'sub_type', 'rules']
    let oldPur = purfyObj(oldProps, PICKED_PROPS);
    let newPur = purfyObj(newProps, PICKED_PROPS);
    let detailedDiff = ZY.detailedDiff(oldPur, newPur);
    // console.log(detailedDiff)
    try {
      // 这次的文件
      let file = new File([serverProps], fileName, {
        type: "text/plain",
      });
      // 和上次的差别
      let diffed = new File([ZY.JSON5.stringify(detailedDiff)], fileName, {
        type: "text/plain",
      });
      // console.log(serverProps)
      let formdata = new FormData();
      formdata.append('tableName', tableName)
      formdata.append('file', file);
      formdata.append('diffed', diffed);
      if (data) {
        Object.entries(data).forEach(([key, item]) => {
          formdata.append(key, item);
        })
      }
      let res = await Req.post('/api/zy-boot/json/json5', formdata, {
        headers: {

          'Content-Type': 'multipart/form-data;charset=UTF-8',
          ...headers
        }
      })
      // obj.metas = {
      //   form_data: res.data
      // }
      return res.data;
    } catch (e) {
      console.log('saveJson err', e)
      return Promise.reject(e)
    }
  }

  return {saveJson}
}
