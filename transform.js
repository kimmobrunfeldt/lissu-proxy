var moment = require('moment');


function transform(data) {
    var vehicles = data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;

    return {
        vehicles: vehicles.map(transformVehicle)
    };
}

function transformVehicle(vehicle) {
    var journey = vehicle.MonitoredVehicleJourney;

    return {
        id: journey.VehicleRef.value,
        line: journey.LineRef.value,
        latitude: journey.VehicleLocation.Latitude,
        longitude: journey.VehicleLocation.Longitude,
        rotation: journey.Bearing,
        origin: journey.OriginName.value,
        destination: journey.DestinationName.value,
        operator: journey.OperatorRef.value,
        direction: journey.DirectionRef.value,
        validUntil: moment(vehicle.ValidUntilTime).toISOString()
    };
}

module.exports = transform;
