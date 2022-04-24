# NGSI Source

This custom node is a simple node that allows to obtain NGSIv2 entities.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Representation`: normalized or keyValues
-   `Entity type`: affected entity type
-   `ID pattern`: entity ID pattern of affected entities
-   `Attrs`: list of attributes to retrieve
-   `Query`: query conditions using Simple Query Language
-   `Buffering`: whether to output all retirived entities at once

## Inputs

### Payload  *JSON Object*

A `msg.payload` should contains a query condition to retrieves NGSIv2 entitites.

```
{
  "idPattern": ".*",
  "type": "T",
  "attrs": [
    "humidity"
  ],
  "q": "temperature>29",
  "keyValues": true
}
```

## Outputs

### Payload *JSON Array*

A `msg.payload` contains NGSIv2 entities.

## Examples

### Input 1

```
{
  "idPattern": ".*"
}
```

### Output 1

```
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 30,
      "metadata": {}
    }
  }
]
```

### Input 2

```
{
  "type": "T",
  "attrs": [
    "humidity"
  ]
}
```

### Output 2

```
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51,
      "metadata": {}
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    }
  }
]
```

### Input 3

```
{
  "type": "T",
  "q": "temperature>29"
}
```

### Output 3

```
[
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 30,
      "metadata": {}
    }
  }
]
```

### Input 4

```
{
  "type": "T",
  "q": "temperature>29",
  "keyValues": true
}
```

### Output 4

```
[
  {
    "id": "E2",
    "type": "T",
    "humidity": 50,
    "temperature": 30
  }
]
```
