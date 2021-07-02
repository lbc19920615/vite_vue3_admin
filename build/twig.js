var Twig = require('twig'), // Twig module
    twig = Twig.twig;

var JSON5 = require('json5')

// place to keep flags
var vuecoms = {};

// expose the internal Twig object for extension
Twig.extend(function(Twig) {
    Twig.exports.extendTag({
        // unique name for tag type
        type: "vuecom",
        // regex match for tag (vuecom white-space anything)
        regex: /^vuecom\s+(.+)$/,
        // this is a standalone tag and doesn't require a following tag
        next: [ ],
        open: true,

        // runs on matched tokens when the template is loaded. (once per template)
        compile: function (token) {
            var expression = token.match[1];

            // Compile the expression. (turns the string into tokens)
            token.stack = Twig.expression.compile.apply(this, [{
                type:  Twig.expression.type.expression,
                value: expression
            }]).stack;

            console.log(token.stack)

            delete token.match;
            return token;
        },

        // Runs when the template is rendered
        parse: function (token, context, chain) {
            // parse the tokens into a value with the render context
            var param = Twig.expression.parse.apply(this, [token.stack, context]),
                output = "";

            console.log(typeof param, JSON5.parse(param))
            try {
                var obj = JSON5.parse(param)
                output = `<${obj.tag} />`
            } catch (e) {
                console.error(e)
            }


            return {
                chain: false,
                output: output
            };
        }
    });
});

module.exports = Twig
