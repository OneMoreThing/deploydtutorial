require('shelljs/make');
var md = require('node-markdown').Markdown;

var path = require('path');

target.all = function() {
  target.markdown();
};

target.markdown = function() {
  var files = ls('*.markdown');
  files.forEach(function(file) {
    var basename = path.basename(file, '.markdown');
    md(basename).to(basename + '.html');
  });
};

