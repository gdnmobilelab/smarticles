var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var getData = require('./data.js');
var deasync = require('deasync');
var browserify = require('browserify');
var stringify = require('stringify');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = getData();

var useLocalAPI = process.argv.slice(2);
console.log(useLocalAPI);
console.log(typeof useLocalAPI);

// HTML
var html = fs.readFileSync('src/templates/index.html', 'utf8');
var partials = glob.readdirSync('src/templates/**/*.html');
partials.forEach(function (partial) {
    var name = partial.replace('src/templates/', '').split('.')[0];
    var template = fs.readFileSync(partial, 'utf8');
    handlebars.registerPartial(name, template);
});

handlebars.registerHelper("switch", function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this); // Process the body of the switch block
    delete this._switch_value_;
    return html;
});

handlebars.registerHelper("case", function(value, options) {
    if (value == this._switch_value_) {
        return options.fn(this);
    }
});

var template = handlebars.compile(html);
fs.writeFileSync('.build/index.html', template(data));

// CSS
var css = sass.renderSync({
    file: 'src/sass/styles.scss'
}).css.toString('utf8');
fs.writeFileSync('.build/styles.css', css);

// JS
var isDone = false;
browserify('./src/javascripts/main.js').transform(stringify, {
    appliesTo: { includeExtensions: ['.html'] }
}).bundle(function(err, buf) {
    if (err) {
        console.log(err);
    }

    var compiled = buf.toString();
    fs.writeFileSync('.build/main.js', compiled);
    isDone = true;
});

deasync.loopWhile(function() {
    return !isDone;
});

// Data
console.log('writing file');
fs.writeFileSync('.build/characters.json', JSON.stringify(data.characters));
fs.writeFileSync('.build/data.json', JSON.stringify(data));

fs.copySync('src/assets/', '.build/assets/');
fs.copySync('root/manifest.json', '.build/manifest.json');
