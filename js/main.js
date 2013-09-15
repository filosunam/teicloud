'use strict';

requirejs.config({
  paths: {
    jquery      : '../components/jquery/jquery.min',
    underscore  : '../components/underscore/underscore-min',
    d3          : '../components/d3/d3.min',
    d3cloud     : '../components/d3cloud/d3.layout.cloud',
    teiparser   : '../node_modules/teiparser/parser',
    sha1        : '../node_modules/teiparser/dep/sha1'
  },
  shim: {
    cloud: [
      'jquery',
      'underscore',
      'teiparser',
      'd3cloud'
    ],
    teiparser: {
      deps: ['sha1'],
      exports: 'Parser'
    },
    d3cloud: ['d3']
  }
});

requirejs(['cloud'], function (Cloud) {

  // cloudy
  var Cloudy = new Cloud();

  // set structure to parse
  Parser.structure = { tags: ['term'] };

  // event
  $(document).delegate('#file', 'change', function (e) {

    var file = e.target.files[0];

    // only modern browsers :\
    var reader = new FileReader();

    reader.onload = function (e) {
      var content = e.target.result;
      var parser  = new Parser($(content));

      var word,
          words = [],
          divs = parser.getFolios();

      divs.forEach(function (div) {
        div.tags.forEach(function (t) {

          word = _.findWhere(words, { text: t.content });

          if (word) {
            word.size++;
          } else {
            words.push({ text: t.content, group: t.type, size: 1 });
          }
        });
      });

      console.log(words.length + " words found", words);

      // generate tag cloud
      Cloudy.words(words);
      Cloudy.show();

    }

    reader.readAsText(file);

  });

});
