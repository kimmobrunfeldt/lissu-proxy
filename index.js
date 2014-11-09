var Promise = require('bluebird');
var connect = require('connect');
var http = require('http');
var request = Promise.promisify(require('request'));

var Timer = require('./timer');
var transform = require('./transform');


var API_URL = 'http://data.itsfactory.fi/siriaccess/vm/json';
var LOOP_INTERVAL = 1000;


var app = connect();
var state = {};

function fetch() {
    return request({json:true, url: API_URL})
    .then(function(response, body) {
        console.log('Fetching data from API');

        var response = response[0];
        if (response.statusCode === 200) {
            console.log('Got 200 OK response');
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
    console.log('Serve cached content');
    res.end(JSON.stringify(state.busData, null, 2));
});


var server = http.createServer(app);
server.listen(8080);
