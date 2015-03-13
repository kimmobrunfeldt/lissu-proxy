var production = process.env.NODE_ENV === 'production';

var productionPort = process.env.PORT || 80;
var port = production ? productionPort : 9000;

module.exports = {
    port: port,
    apiUrl: 'http://data.itsfactory.fi/siriaccess/vm/json',
    loopInterval: 1000
};
