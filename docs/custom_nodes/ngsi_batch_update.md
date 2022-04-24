# NGSI Batch update

This custom node is a simple node that allows to update NGSIv2 entity(ies). Entity data shall be provided as part of the
`msg.payload`.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch_update-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch_update-02.png)

- `name`: a name for a node instance

## Inputs *JSON Araay* or *JSON Ojbect*

A `msg.payload` should contain NGSIv2 entities as JSON Array or a JSON Object with two properties, `actionType` and
`entites`.

## Outputs *Number* or null

A `msg.payload` contains `204` (as Number) or null.

## Examples

### Input 1 (JSON Array)

```
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51
    },
    "temperature": {
      "type": "Number",
      "value": 25
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50
    },
    "temperature": {
      "type": "Number",
      "value": 30
    }
  }
]
```

### Input 2 (JSON Object with two properties)

```
{
  "actionType": "append",
  "entities": [
    {
      "id": "E1",
      "type": "T",
      "humidity": {
        "type": "Number",
        "value": 51
      },
      "temperature": {
        "type": "Number",
        "value": 25
      }
    },
    {
      "id": "E2",
      "type": "T",
      "humidity": {
        "type": "Number",
        "value": 50
      },
      "temperature": {
        "type": "Number",
        "value": 30
      }
    }
  ]
}
```

### Output

```
204
```
