# NGSI attributes

This custom node is a simple node that allows to append, update, upsert or replace attributes of NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Append attributes](#append-attributes)
-   [Update attributes](#update-attributes)
-   [Upsert attributes](#upsert-attributes)
-   [Replace attributes](#replace-attributes)
-   [Use value of actionType in payload](#use-value-of-actionType-in-payload)

</details>

## Append attributes

It allows to append attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `append`
-   `Entity id`: Id of an entity containing attributes to be appended
-   `Entity type`: Type of an entity containing attributes to be appended
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Object*

A `msg.payload` should contain an object with the attributes.

```json
{
  "temperature": {
    "type": "Number",
    "value": 17,
    "metadata": {}
  }
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Update attributes

It allows to update attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity id`: Id of an entity containing attributes to be updated
-   `Entity type`: Type of an entity containing attributes to be updated
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Object*

A `msg.payload` should contain an object with the attributes.

```json
{
  "temperature": {
    "type": "Number",
    "value": 20,
    "metadata": {}
  }
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Upsert attributes

It allows to upsert attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `upsert`
-   `Entity id`: Id of an entity containing attributes to be upserted
-   `Entity type`: Type of an entity containing attributes to be upserted 
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Object*

A `msg.payload` should contain an object with the attributes.

```json
{
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {}
  },
  "humidity": {
    "type": "Number",
    "value": 42.9,
    "metadata": {}
  }
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Replace attributes

It allows to replace attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `replace`
-   `Entity id`: Id of an entity containing attributes to be replaced
-   `Entity type`: Type of an entity containing attributes to be replaced
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Object*

A `msg.payload` should contain an object with the attributes.

```json
{
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {}
  },
  "relativeHumidity": {
    "type": "Number",
    "value": 45,
    "metadata": {}
  },
  "atmosphericPressure": {
    "type": "Number",
    "value": 1003.5,
    "metadata": {}
  }
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Use value of actionType in payload

It allows to append, update, upsert or replace attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes/attributes-06.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: Id of an entity containing attributes to be appended, updated, upserted or replaced
-   `Entity type`: Type of an entity containing attributes to be appended, updated, upserted or replaced
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism
-   `Encode forbidden chars`: `off` or `on`

### Input

payload *JSON Object*

A `msg.payload` should contain a JSON Object with actionType and an object with the attributes.

```json
{
  "actionType": "append",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 17,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "update",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 20,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "upsert",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    },
    "humidity": {
      "type": "Number",
      "value": 42.9,
      "metadata": {}
    }
  }
}
```

```json
{
  "actionType": "replace",
  "id": "E2",
  "attributes": {
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    },
    "relativeHumidity": {
      "type": "Number",
      "value": 45,
      "metadata": {}
    },
    "atmosphericPressure": {
      "type": "Number",
      "value": 1003.5,
      "metadata": {}
    }
  }
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```
