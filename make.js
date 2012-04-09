require('shelljs/make');
var path = require('path');

target.all = function() {
  target.markdown();
};

target.markdown = function() {
  var files = ls('*.markdown');
  files.forEach(function(file) {
    var basename = path.basename(file, '.markdown');
    exec('markdown ' + file, {silent: true}).output.to(basename + '.html');
  });
};

