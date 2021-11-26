export function useToolApi() {
  /**
   * saveJson
   * @param serverProps
   * @returns {Promise<*>}
   */
  async function saveJson(serverProps = '' ) {

    console.log(serverProps)
    // onChange()
    try {
      let res = await Req.post('/api/json', serverProps)
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
