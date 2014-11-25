# Lissu Proxy API

Lissu is a service where you can see real time locations of buses in Tampere.

Original Lissu API doesn't handle load well. This proxy serves data from Lissu API in a more
convenient format.

## API

This proxy API returns data in JSON format. Original API is here: http://data.itsfactory.fi/siriaccess/vm/json
There is some documentation of original Lissu SIRI API in [ITS Factory's page](http://wiki.itsfactory.fi/index.php/ITS_Factory_Developer_Wiki) under *Public Transport*.

This proxy API fetches newest data from original API in 1000ms interval.

### Response format

```
{
    "vehicles": [
        [Vehicle data object],
        [Vehicle data object],
        ...
    ]
}
```

### Vehicle data

Parameter | Type | Description
--------- | ---- | -----------
**id**               | *String*  |  Bus identifier. Example: `TKL_34`
**line**             | *String*  |  Bus line name. Example: `90M`
**latitude**         | *Number*  |  Latitude coordinate. Example: `61.5192917`
**longitude**        | *Number*  |  Longitude coordinate. Example: `23.6257467`
**rotation**         | *Number*  |  Rotation of a bus. *0* to *360*. *0* means the bus is stopped. East would be *90*. Example: `12`.
**origin**           | *String*  |  Origin of a bus route. Example: `Hermia`
**destination**      | *String*  |  Destination of bus route. Example: `Särkitie`
**operator**         | *String*  |  Bus operator name. Example: `TKL` or `Paunu`.
**direction**        | *String*  |  Determines which direction bus is headed to. Example: `2`
**validUntil**       | *Date*    |  Data is valid until this date time.. I guess?. Example: `2014-11-13T20:56:34.007Z`


### Errors

If error occured when fetching vehicle data from original API, response contains *error* key:

```json
{
    "error": true,
    "busData": {}
}
```
