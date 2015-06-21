var moment = require('moment');

// Returned format from original API is a bit strange and very deeply nested.
// Original API url: http://data.itsfactory.fi/siriaccess/vm/json

function transform(data) {
    var vehicles = data;

    return {
        vehicles: vehicles.map(transformVehicle),
        responseUnixTime: (new Date()).getTime()
    };
}

function transformVehicle(vehicle) {
    return {
        id: vehicle.journeyId,
        line: vehicle.lCode,
        latitude: vehicle.y,
        longitude: vehicle.x,
        rotation: vehicle.bearing,
        direction: vehicle.direction,
        type: 'bus'
    };
}

module.exports = transform;
