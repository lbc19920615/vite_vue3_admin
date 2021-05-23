Function.prototype.bindFn = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('')
  }
  var self = this
  var args = [].slice.call(arguments, 1)

  var bound = function () {
    var boundArgs = [].slice.call(arguments)
    var finalArgs = args.contact(boundArgs)

    // new 调用时，其实this instanceof bound判断也不是很准确。es6 new.target就是解决这一问题的。
    if (this instanceof bound) {
      if (self.prototype) {
        function F() {}
        F.prototype = self.prototype
        bound.prototype = new F()
      }
      var result = self.apply(context, finalArgs)
      // 这里是实现上文描述的 new 的第 5 步
      // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，
      // 那么`new`表达式中的函数调用会自动返回这个新的对象。
      var isObject = typeof result === 'object' && result !== null
      var isFunction = typeof result === 'function'
      if (isObject || isFunction) {
        return result
      }
      return this
    } else {
      return self.apply(context, finalArgs)
    }
  }
  return bound
}
