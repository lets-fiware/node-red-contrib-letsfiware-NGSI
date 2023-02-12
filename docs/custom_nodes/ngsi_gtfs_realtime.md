# GTFS realtime to NGSI

This custom node is a simple node that allows to transform from GTFS-realtime data to NGSIv2 entities.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/gtfs-realtime/gtfs-realtime-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/gtfs-realtime/gtfs-realtime-02.png)

- `name`: a name for a node instance

## Inputs

### Payload  *JSON Array* or *string*

A `msg.payload` should contain GTFS-realtime data or a URL that provides GTFS-realtime data.
 If a JSON Object containing GTFS-realtime data is provided, it will be automatically converted to a JSON Array.

## Outputs

### Payload *JSON Array*

A `msg.payload` contains NGSIv2 entities.

## Examples

### Input 1

```
https://gtfs.letsfiware.jp/gtfs-realtime/vehicle-position.bin
```

### Input 2

```
[
  {
    "id": "bus01",
    "vehicle": {
      "trip": {
        "tripId": "00000000000000000000000000000000",
        "startDate": "20220301",
        "scheduleRelationship": "SCHEDULED",
        "routeId": "001"
      },
      "position": {
        "latitude": 35.1,
        "longitude": 135.2,
        "bearing": 180.3
      },
      "currentStopSequence": 1,
      "currentStatus": "IN_TRANSIT_TO",
      "timestamp": "0000000001",
      "stopId": "S0001",
      "vehicle": {
        "id": "bus01"
      }
    }
  }
]
```

### Output 2

```
[
  {
    "type": "Vehicle",
    "id": "urn:ngsi-ld:Vehicle:bus01",
    "currentStatus": {
      "type": "Text",
      "value": "IN_TRANSIT_TO"
    },
    "currentStopSequence": {
      "type": "Number",
      "value": 1
    },
    "location": {
      "type": "geo:json",
      "value": {
        "coordinates": [
          135.2,
          35.1
        ],
        "type": "Point"
      }
    },
    "position": {
      "type": "StructuredValues",
      "value": {
        "bearing": 180.3,
        "latitude": 35.1,
        "longitude": 135.2
      }
    },
    "stopId": {
      "type": "Text",
      "value": "S0001"
    },
    "timestamp": {
      "type": "Text",
      "value": "0000000001"
    },
    "trip": {
      "type": "StructuredValues",
      "value": {
        "routeId": "001",
        "scheduleRelationship": "SCHEDULED",
        "startDate": "20220301",
        "tripId": "00000000000000000000000000000000"
      }
    },
    "vehicle": {
      "type": "StructuredValues",
      "value": {
        "id": "bus01"
      }
    }
  }
]
```
