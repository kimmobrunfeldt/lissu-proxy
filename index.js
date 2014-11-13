var Promise = require('bluebird');
var connect = require('connect');
var http = require('http');
var request = Promise.promisify(require('request'));

var Timer = require('./timer');
var transform = require('./transform');
var config = require('./config');


var API_URL = 'http://data.itsfactory.fi/siriaccess/vm/json';
var LOOP_INTERVAL = 1000;


var app = connect();
var state = {};

function fetch() {
    return request({json:true, url: API_URL})
    .then(function(response, body) {
        var response = response[0];

        if (response.statusCode === 200) {
            state.busData = transform(response.body);
        } else {
            throw new Error("Response was not OK. Status code: " + response.statusCode);
        }
    }).catch(function(err) {
        console.error('Error while fetching data from API');
        console.error(err);
    });
}

var timer = new Timer(fetch, {
    interval: LOOP_INTERVAL
});
timer.start();

app.use(function(req, res) {
    res.end(JSON.stringify(state.busData, null, 2));
});


var server = http.createServer(app);
server.listen(config.port);

// Handle SIGTERM gracefully. Heroku will send this before idle.
process.on('SIGTERM', function() {
    console.log('SIGTERM received');
    console.log('Closing server');
    server.close(function() {
        console.log('Server closed');
    });
});
