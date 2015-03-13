var production = process.env.NODE_ENV === 'production';

var productionPort = process.env.PORT || 80;
var port = production ? productionPort : 9000;

module.exports = {
    port: port,
    apiUrl: 'http://lissu.tampere.fi/ajax_servers/busLocations.php',
    loopInterval: 1000
};
