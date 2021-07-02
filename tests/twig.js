var Twig = require('../build/twig')
var twig = Twig.twig

var template = twig({data:`{% vuecom '{tag: "user-name-1"}' %}`}).render();

console.log(template)
