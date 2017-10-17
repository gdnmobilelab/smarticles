var thingsToUpload = [
    {
        files: '**/*',
        headers: {
            CacheControl: 'max-age=20'
        }
    },
    {
        files: '*',
        headers: {
            CacheControl: 'max-age=20'
        }
    }
];

var path = require( 'path' );
var fs = require( 'fs-extra' );
var mime = require( 'mime' );
var AWS = require( 'aws-sdk' );
var glob = require( 'glob' );
var filesize = require( 'filesize' );
var stevedore = require( 'stevedore' );
var chalk = require( 'chalk' );
var request = require('sync-request');
var config = require('./config.js').config;

var BUCKET = 'www.gdnmobilelab.com';

var BASE_DIR = path.resolve( '.build' );
var version = Date.now();
var MAX_CONCURRENT_UPLOADS = 8;

var data = request('GET', config.dataUrl);
    data = JSON.parse(data.getBody('utf8'));

var slug = data.sheets.Furniture[2].value;

if (!slug) {
    console.log('No slug provided in Furniture. Deploy aborted');
    return false;
}

try {
    var CREDENTIALS = new AWS.SharedIniFileCredentials({profile: 'mobilelab'});
    AWS.config.credentials = CREDENTIALS;
} catch ( err ) {
    var message = 'Could not find AWS credentials. Make sure they have been added to ~/.aws/credentials';

    console.log( message );
    process.exit( 1 );
}

var s3 = new AWS.S3();

var uploadQueue = [];

thingsToUpload.forEach( function ( thing ) {
    var files = glob.sync( thing.files, {
        cwd: BASE_DIR,
        nodir: true
    });

    files.forEach( function ( file ) {
        uploadQueue.push({
            file: file,
            headers: thing.headers
        });
    });
});

var inFlight = 0;
var loader;

while ( inFlight < MAX_CONCURRENT_UPLOADS && uploadQueue.length ) {
    uploadNextItem();
}

function uploadNextItem () {
    var item = uploadQueue.shift();

    if ( !item ) {
        if ( !loader ) {
            loader = stevedore();
        }

        loader.message( inFlight + ' items remaining    ' );

        if ( !inFlight ) {
            loader.stop();
            console.log( '\nupload complete!' );
            console.log( '\nView at ' + chalk.green( BUCKET + '/smarticles/' + slug + '/index.html' ) + '\n ' );
        }

        return;
    }

    inFlight += 1;

    var data = fs.readFileSync( path.join( BASE_DIR, item.file ) );

    var options = {
        Bucket: BUCKET,
        ACL: 'public-read',
        Key: 'smarticles/' + slug + '/' + item.file,
        Body: data,
        ContentType: mime.lookup( item.file )
    };

    Object.keys( item.headers ).forEach( function ( header ) {
        options[ header ] = item.headers[ header ];
    });

    console.log( '* %s : %s', pad( filesize( data.length ), 12 ), item.file );

    s3.putObject( options, function ( err ) {
        if ( err ) {
            console.log( 'err', err );
            throw err;
        }

        inFlight -= 1;
        uploadNextItem();
    });
}

function pad ( str, len ) {
    while ( str.length < len ) str += ' ';
    return str;
}
