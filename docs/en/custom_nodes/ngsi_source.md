# NGSI Source

This custom node is a simple node that allows to obtain NGSIv2 entities.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source/source-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Properties](#properties)
-   [Inputs](#inputs)
-   [Outputs](#outputs)
-   [Examples](#examples)

</details>

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source/source-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Representation`: normalized or keyValues
-   `Entity type`: affected entity type
-   `ID pattern`: entity ID pattern of affected entities
-   `Attrs`: list of attributes to retrieve
-   `Query`: query conditions using Simple Query Language
-   `Buffering`: whether to output all retrieved entities at once

## Input

payload  *JSON Object*

A `msg.payload` should contain a query condition to retrieves NGSIv2 entitites.

```json
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

## Output

payload *JSON Array*

A `msg.payload` contains NGSIv2 entities.

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

## Examples

### Input 1

```json
{
  "idPattern": ".*"
}
```

### Output 1

```json
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

```json
{
  "type": "T",
  "attrs": [
    "humidity"
  ]
}
```

### Output 2

```json
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

```json
{
  "type": "T",
  "q": "temperature>29"
}
```

### Output 3

```json
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

```json
{
  "type": "T",
  "q": "temperature>29",
  "keyValues": true
}
```

### Output 4

```json
[
  {
    "id": "E2",
    "type": "T",
    "humidity": 50,
    "temperature": 30
  }
]
```
