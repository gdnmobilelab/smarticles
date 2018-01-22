var watch = require('node-watch');
var cmd = require('node-cmd');
var static = require('node-static');
var chalk = require( 'chalk' );

var useLocalAPI = process.argv.slice(2);

cmd.get('node scripts/compile.js -- ' + useLocalAPI);

watch('./src/', { recursive: true }, function(evt, file) {
    console.log(chalk.yellow('Change to ' + file));
    cmd.get('node scripts/compile.js -- ' + useLocalAPI);
});

var file = new static.Server('./.build/', {
    'cache': 0,
    'headers': {
        'Access-Control-Allow-Origin': '*'
    }
});

console.log(chalk.green('serving at http://localhost:8000/index.html'))

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8000);
