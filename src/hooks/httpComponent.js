function commonLoadStep( name, loadPromise, {

}) {
  return new Promise(async (resolve) => {
    let [e,res] = await ZY.awaitTo(
      loadPromise
    )
    let JSON5 = ZY.JSON5;
    // console.log(e)
    const config = JSON5.parse(JSON5.stringify(res.default))

    for (let [partName, data] of Object.entries(config.defaultVal)) {
      let defaultObj = JSON5.parse(JSON5.stringify(data))

      setPartModel( name, partName,
        defaultObj
      )
    }
    resolve(config)
  })
}
