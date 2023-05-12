# NGSI Batch update

This custom node is a simple node that allows to append, appendStrict, update, replace or delete several entities in a single batch operation.
Entity data shall be provided as part of the `msg.payload`.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Append entities](#append-entities)
-   [AppendStrict entities](#appendstrict-entities)
-   [Update entities](#update-entities)
-   [Replace entities](#replace-entities)
-   [Delete entities](#delete-entities)
-   [Use value of actionType in payload](#use-value-of-actionType-in-payload)

</details>

## Append entities

It allows to append several entities.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `append`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Array* or *JSON Object*

A `msg.payload` should contain NGSIv2 entities as JSON Array or JSON Object.

```json
[
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor001",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 20.6,
      "metadata": {}
    }
  },
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor002",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 20.6,
      "metadata": {}
    }
  }
]
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## AppendStrict entities

It allows to append several entities strictly.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `appendStrict`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Array* or *JSON Object*

A `msg.payload` should contain NGSIv2 entities as JSON Array or JSON Object.

```json
[
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor003",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 20.6,
      "metadata": {}
    }
  },
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor004",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 20.6,
      "metadata": {}
    }
  }
]
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Update entities

It allows to update several entities.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Array* or *JSON Object*

A `msg.payload` should contain NGSIv2 entities as JSON Array or JSON Object.

```json
[
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor001",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 30.6,
      "metadata": {}
    }
  },
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor002",
    "type": "Sensor",
    "temperature": {
      "type": "Number",
      "value": 30.6,
      "metadata": {}
    }
  }
]
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Replace entities

It allows to replace several entities.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `replace`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Array* or *JSON Object*

A `msg.payload` should contain NGSIv2 entities as JSON Array or JSON Object.

```json
[
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor001",
    "type": "Sensor",
    "humidity": {
      "type": "Number",
      "value": 31,
      "metadata": {}
    }
  },
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor002",
    "type": "Sensor",
    "humidity": {
      "type": "Number",
      "value": 31,
      "metadata": {}
    }
  }
]
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Delete entities

It allows to delete several entities.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-06.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Array* or *JSON Object*

A `msg.payload` should contain NGSIv2 entities as JSON Array or JSON Object.

```json
[
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor001",
    "type": "Sensor",
    "humidity": {
      "type": "Number",
      "value": 31,
      "metadata": {}
    }
  },
  {
    "id": "urn:ngsi-ld:WeatherObserved:sensor002",
    "type": "Sensor",
    "humidity": {
      "type": "Number",
      "value": 31,
      "metadata": {}
    }
  }
]
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Use value of actionType in payload

It allows to append, appendStrict, update, replace or delete several entities.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/batch-update/batch-update-07.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Representation`: `normalized` or `keyValues`
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input (append)

payload *JSON Object*

When appending entities, a `msg.payload` should contain actionType and NGSIv2 entities as JSON Object.
A `msg.payload` should contain `actionType` and `entities` as JSON Object.

```json
{
  "actionType": "append",
  "entities": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor001",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 20.6,
        "metadata": {}
      }
    },
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor002",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 20.6,
        "metadata": {}
      }
    }
  ]
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (append strictly)

payload *JSON Object*

When appending entities strictly, a `msg.payload` should contain actionType and NGSIv2 entities as JSON Object.
A `msg.payload` should contain `actionType` and `entities` as JSON Object.

```json
{
  "actionType": "appendStrict",
  "entities": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor003",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 20.6,
        "metadata": {}
      }
    },
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor004",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 20.6,
        "metadata": {}
      }
    }
  ]
}
```

### Output (append strictly)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (update)

payload *JSON Object*

When updating entities, a `msg.payload` should contain actionType and NGSIv2 entities as JSON Object.
A `msg.payload` should contain `actionType` and `entities` as JSON Object.

```json
{
  "actionType": "update",
  "entities": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor001",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 30.6,
        "metadata": {}
      }
    },
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor002",
      "type": "Sensor",
      "temperature": {
        "type": "Number",
        "value": 30.6,
        "metadata": {}
      }
    }
  ]
}
```

### Output (update)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (replace)

payload *JSON Object*

When replacing entities, a `msg.payload` should contain actionType and NGSIv2 entities as JSON Object.
A `msg.payload` should contain `actionType` and `entities` as JSON Object.

```json
{
  "actionType": "replace",
  "entities": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor001",
      "type": "Sensor",
      "humidity": {
        "type": "Number",
        "value": 31,
        "metadata": {}
      }
    },
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor002",
      "type": "Sensor",
      "humidity": {
        "type": "Number",
        "value": 31,
        "metadata": {}
      }
    }
  ]
}
```

### Output (replace)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (delete)

payload *JSON Object*

When deleting entities, a `msg.payload` should contain actionType and NGSIv2 entities as JSON Object.
A `msg.payload` should contain `actionType` and `entities` as JSON Object.

```json
{
  "actionType": "delete",
  "entities": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor001",
      "type": "Sensor",
      "humidity": {
        "type": "Number",
        "value": 31,
        "metadata": {}
      }
    },
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor002",
      "type": "Sensor",
      "humidity": {
        "type": "Number",
        "value": 31,
        "metadata": {}
      }
    }
  ]
}
```

### Output (delete)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```
