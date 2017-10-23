var watch = require('node-watch');
var cmd = require('node-cmd');
var static = require('node-static');

watch('./src/', { recursive: true }, function(evt, file) {
    console.log('change to ' + file);
    cmd.get('node scripts/compile.js');
});

var file = new static.Server('./.build/', {
    'cache': 0,
    'headers': {
        'Access-Control-Allow-Origin': '*'
    }
});

console.log('serving at http://localhost:8000/index.html')

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8000);
