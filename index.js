var Promise = require('bluebird');
var express = require('express');
var http = require('http');
var request = Promise.promisify(require('request'));
var iconvlite = require('iconv-lite');

var Timer = require('./timer');
var transform = require('./transform');
var config = require('./config');


var API_URL = 'http://data.itsfactory.fi/siriaccess/vm/json';
var LOOP_INTERVAL = 1000;

var app = express();
var state = {};

function fetch() {
    return request({url: API_URL})
    .then(function(response, body) {
        var response = response[0];

        if (response.statusCode === 200) {
            state.busData = transform(JSON.parse(response.body));
        } else {
            throw new Error("Response was not OK. Status code: " + response.statusCode);
        }
    }).catch(function(err) {
        console.error('Error while fetching data from API');
        console.error(err);
        console.error(err.stack);
    });
}

var timer = new Timer(fetch, {
    interval: LOOP_INTERVAL
});
timer.start();

app.set('json spaces', 2);
app.get('/', function(req, res) {
    res.json(state.busData);
});


var server = app.listen(config.port, function() {
    console.log('Serving at port', config.port);
});

// Handle SIGTERM gracefully. Heroku will send this before idle.
process.on('SIGTERM', function() {
    console.log('SIGTERM received');
    console.log('Closing server');
    server.close(function() {
        console.log('Server closed');
    });
});
