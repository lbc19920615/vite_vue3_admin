export function useToolApi() {
  /**
   * saveJson
   * @param serverProps
   * @param fileName
   * @param newProps
   * @param oldProps
   * @returns {Promise<*>}
   */
  async function saveJson(serverProps = '', fileName = '',
                          {newProps, oldProps} = {} ) {

    let detailedDiff = ZY.detailedDiff(oldProps ?? {}, newProps ?? {});
    // console.log(detailedDiff, oldProps, newProps)
    try {
      let file = new File([serverProps], fileName, {
        type: "text/plain",
      });
      let diffed = new File([detailedDiff], fileName, {
        type: "text/plain",
      });
      // console.log(serverProps)
      let formdata = new FormData();
      formdata.append('file', file);
      formdata.append('diffed', file)
      let res = await Req.post('/api/json5', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8'
        }
      })
      // obj.metas = {
      //   form_data: res.data
      // }
      return res.data

    } catch (e) {
      console.log(e)
    }
  }

  return {saveJson}
}
