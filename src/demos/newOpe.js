function newOpe(ctor) {
  if (typeof ctor !== 'function') {
    throw new Error('err')
  }
  newOpe.target = ctor
  var newObj = Object.create(ctor.prototype)
  var args = [].slice.call(arguments, 1)
  var ctorReturnResult = ctor.apply(newObj, args)

  var isObject =
    typeof ctorReturnResult === 'object' && ctorReturnResult !== null
  var isFunction = typeof ctorReturnResult === 'function'
  if (isObject || isFunction) {
    return ctorReturnResult
  }

  return newObj
}
