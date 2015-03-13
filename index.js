var Promise = require('bluebird');
var express = require('express');
var compression = require('compression');
var cors = require('cors');
var http = require('http');
var request = Promise.promisify(require('request'));
var moment = require('moment');

var Timer = require('./timer');
var transform = require('./transform');
var config = require('./config');

var state = {
    error: false
};

function fetch() {
    var query = '?ts=' + (new Date()).getTime();
    return request({url: config.apiUrl + query})
    .then(function(response, body) {
        var response = response[0];

        if (response.statusCode === 200) {
            state.error = false;
            state.busData = transform(JSON.parse(response.body));

            // If response time is hour or more
            var responseTime = moment(state.busData.responseUnixTime);
            var diffInMinutes = Math.abs(responseTime.diff(moment(), 'minutes'));
            if (diffInMinutes >= 60) {
                state.error = true;
                state.msg = 'Tampereen joukkoliikenteen järjestelmässä on häiriö.';
                state.busData.vehicles = [];
                console.error('Data is too old, diff in minutes:', diffInMinutes);
                console.error(responseTime.unix());
            }
        } else {
            state.error = true;
            throw new Error("Response was not OK. Status code: " + response.statusCode);
        }
    }).catch(function(err) {
        state.error = true;
        console.error('Error while fetching data from API');
        console.error(err);
        console.error(err.stack);
    });
}

var timer = new Timer(fetch, {
    interval: config.loopInterval
});
timer.start();

var app = express();
app.use(compression({
    // Compress everything over 10 bytes
    threshold: 10
}));
app.use(cors());
app.set('json spaces', 2);
app.get('/', function(req, res) {
    if (state.error) {
        var response = {
            error: true,
            busData:{}
        };

        if (state.msg) {
            response.msg = state.msg;
        }

        res.json(response);
    } else {
        res.json(state.busData);
    }
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
