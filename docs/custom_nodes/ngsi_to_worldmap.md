# NGSI to Worldmap

This custom node is a simple node that allows to transform from NGSIv2 entities to "things" data for the Worldmap node.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/to-worldmap-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/to-worldmap-02.png)

- `name`: a name for a node instance
- `attr to use as name`: attribute name that has a value used as name for the Worldmap node
- `attr for Worldmap`: attribute name that contains attributes for the Worldmap node

## Inputs

### Payload  *JSON Array*

A `msg.payload` contains NGSIv2 entity(ies).
If a string or a JSON Object containing NGSIv2 entity(ies) is provided, it will be automatically converted to a JSON Array.

## Outputs

### Payload *JSON Array*

A `msg.payload` contains "things" data for the Worldmap node.

## Example

### Input 1

```
[
  {
    "id": "E1",
    "type": "T",
    "name": {
      "type": "Text",
      "value": "E1"
    },
    "location": {
      "type": "geo:json",
      "value": {
        "type": "Point",
        "coordinates": [
          135,
          35
        ]
      }
    }
  }
]
```

### Output 1

```
[
  {
    "lat": 35,
    "lon": 135,
    "name": "E1"
  }
]
```

### Input 2

```
[
  {
    "id": "E1",
    "type": "T",
    "name": {
      "type": "Text",
      "value": "E1"
    },
    "location": {
      "type": "geo:json",
      "value": {
        "type": "Point",
        "coordinates": [
          135,
          35
        ]
      }
    },
    "__worldmap__": {
      "type": "StructuredValues",
      "value": {
        "icon": "bicycle"
      }
    }
  }
]
```

### Output 2

```
[
  {
    "lat": 35,
    "lon": 135,
    "name": "E1",
    "icon": "bicycle"
  }
]
```
