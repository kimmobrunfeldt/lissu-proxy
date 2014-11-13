var production = process.env.NODE_ENV === 'production';

var productionPort = process.env.PORT || 80;
var port = production ? productionPort : 8080;

module.exports = {
    port: port
};
