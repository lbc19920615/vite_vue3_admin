// Mathjax to be injected into the document head
export function injectMathJax() {
  if (!window.MathJax) {
    const script = document.createElement('script')
    script.src =
      'mathjax/tex-svg.js'
    script.async = true
    document.head.appendChild(script)
  }
}

/**
 * Global configuration MathJax
 * @param options Custom MathJax global configuration  reference: http://docs.mathjax.org/en/latest/
 * @param callback Mathjax loading is completed, you need to perform the function
 */
export function initMathJax(options = {}, callback) {
  injectMathJax()
  // The default global configuration
  const defaultConfig = {
    tex: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']],
      processEnvironments: true,
      processRefs: true,
    },
    options: {
      skipHtmlTags: ['noscript', 'style', 'textarea', 'pre', 'code'],
      ignoreHtmlClass: 'tex2jax_ignore',
    },
    startup: {
      pageReady: () => {
        callback && callback()
      },
    },
    // svg: {
    //   fontCache: 'global',
    // },
    svg: {
      scale: 1,                      // global scaling factor for all expressions
      minScale: .5,                  // smallest scaling factor to use
      mtextInheritFont: false,       // true to make mtext elements use surrounding font
      merrorInheritFont: true,       // true to make merror text use surrounding font
      mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
      skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
      exFactor: .5,                  // default size of ex in em units
      displayAlign: 'center',        // default for indentalign when set to 'auto'
      displayIndent: '0',            // default for indentshift when set to 'auto'
      fontCache: 'local',            // or 'global' or 'none'
      localID: null,                 // ID to use for local font cache (for single equation processing)
      internalSpeechTitles: true,    // insert <title> tags with speech content
      titleID: 0                     // initial id number to use for aria-labeledby titles
    }
  }

  // const defaultConfig = {
  //   jax: ["input/TeX", "output/SVG"],
  //   extensions: ["tex2jax.js", "MathMenu.js", "MathZoom.js"],
  //   showMathMenu: false,
  //   showProcessingMessages: false,
  //   messageStyle: "none",
  //   SVG: {
  //     useGlobalCache: false
  //   },
  //   TeX: {
  //     extensions: ["AMSmath.js", "AMSsymbols.js", "autoload-all.js"]
  //   },
  //   AuthorInit: function() {
  //     MathJax.Hub.Register.StartupHook("End", function() {
  //       var mj2img = function(texstring, callback) {
  //         var input = texstring;
  //         var wrapper = document.createElement("div");
  //         wrapper.innerHTML = input;
  //         var output = { svg: "", img: ""};
  //         MathJax.Hub.Queue(["Typeset", MathJax.Hub, wrapper]);
  //         MathJax.Hub.Queue(function() {
  //           var mjOut = wrapper.getElementsByTagName("svg")[0];
  //           mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  //           // thanks, https://spin.atomicobject.com/2014/01/21/convert-svg-to-png/
  //           output.svg = mjOut.outerHTML;
  //           var image = new Image();
  //           image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
  //           image.onload = function() {
  //             var canvas = document.createElement('canvas');
  //             canvas.width = image.width;
  //             canvas.height = image.height;
  //             var context = canvas.getContext('2d');
  //             context.drawImage(image, 0, 0);
  //             output.img = canvas.toDataURL('image/png');
  //             callback(output);
  //           };
  //         });
  //       }
  //       // mj2img("\\[f: X \\to Y\\]", function(output){
  //       //   document.getElementById("target").innerText = output.img + '\n' + output.svg;
  //       // });
  //     });
  //   }
  // };

  // Merge configuration
  const mergeConfig = Object.assign({}, defaultConfig, options)
  window.MathJax = mergeConfig

  const latexToImg = function (formula) {
    return new Promise((resolve, reject) => {
      let wrapper = MathJax.tex2svg(`${formula}`, {em: 10, ex: 5,display: true})
      let output = { svg: "", img: "" }
      let mjOut = wrapper.getElementsByTagName("svg")[0]
      // mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      output.svg = mjOut.outerHTML
      var image = new Image()
      image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
      image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        output.img = canvas.toDataURL('image/png');
        resolve(output.img)
      }
      image.onerror = function() {
        reject()
      }
    })
  }

  window.MathJaxLatexToImg = latexToImg
}

/**
 * Manual rendering formula, returns a Promise
 * @param el Need to be mathjax rendered HTMLElement
 * @returns Promise
 */
export function renderByMathjax(el) {
  if (!window.MathJax.version) {
    return
  }

  if (el && !Array.isArray(el)) {
    el = [el]
  }

  return new Promise((resolve, reject) => {
    window.MathJax.typesetPromise(el)
      .then(() => {
        resolve(void 0)
      })
      .catch((err) => reject(err))
  })
}
