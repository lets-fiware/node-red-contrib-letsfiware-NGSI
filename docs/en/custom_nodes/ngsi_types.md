# NGSI types

This custom node is a simple node that allows to retrieve a list of entity types or entity information for a given type.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [List Entity Types](#list-entity-types)
-   [Retrieve entity information for a given type](#retrieve-entity-information-for-a-given-type)
-   [Use value of actionType in payload](#use-value-of-actiontype-in-payload)

</details>

## List Entity Types

It allows to retrieve a list of entity types.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `List Entity Types`
-   `Values`: If true, the response payload is a JSON array with a list of entity types
-   `NoAttrDetail`: If true, the request does not provide attribute type details

### Input

payload *JSON Object*

A `msg.payload` should contain an empty JSON Object.

```json
{}
```

### Output

payload *JSON Array*

A `msg.payload` contains a list of entity types.

```json
[
  {
    "type": "Sensor",
    "attrs": {
      "TimeInstant": {
        "types": [
          "DateTime"
        ]
      },
      "atmosphericPressure": {
        "types": [
          "Number"
        ]
      },
      "dateObserved": {
        "types": [
          "DateTime"
        ]
      },
      "location": {
        "types": [
          "geo:json"
        ]
      },
      "relativeHumidity": {
        "types": [
          "Number"
        ]
      },
      "temperature": {
        "types": [
          "Number"
        ]
      }
    },
    "count": 1
  },
]
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```
200
```

## Retrieve entity information for a given type

It allows to retrieve entity information for a given type.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entity information for a given type`
-   `Entity type`: Type of Entity to retrieve an entity information
-   `NoAttrDetail`: If true, the request does not provide attribute type details

### Input

payload  *String*

A `msg.payload` should contain an Entity type.

```text
Sensor
```

### Output

payload *JSON Object*

A `msg.payload` contains the entity information.

```json
{
  "attrs": {
    "TimeInstant": {
      "types": [
        "DateTime"
      ]
    },
    "atmosphericPressure": {
      "types": [
        "Number"
      ]
    },
    "dateObserved": {
      "types": [
        "DateTime"
      ]
    },
    "location": {
      "types": [
        "geo:json"
      ]
    },
    "relativeHumidity": {
      "types": [
        "Number"
      ]
    },
    "temperature": {
      "types": [
        "Number"
      ]
    }
  },
  "count": 1
}
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

## Use value of actionType in payload

It allows to retrieve a list of entity types or entity information for a given type.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `value of actionType in payload`
-   `Entity type`: Type of Entity to retrieve an entity information
-   `Values`: If true, the response payload is a JSON array with a list of entity types
-   `NoAttrDetail`: If true, the request does not provide attribute type details


### Input (types)

payload *JSON Object*

When retrieving a list of entity types, a `msg.payload` should contain a JSON Object with actionType `types`.

A `msg.payload` should contain actionType with `types`.

```json
{
  "actionType": "types"
}
```

### Output (types)

payload *JSON Array*

A `msg.payload` contains a list of entity types.

```json
[
  {
    "type": "Sensor",
    "attrs": {
      "TimeInstant": {
        "types": [
          "DateTime"
        ]
      },
      "atmosphericPressure": {
        "types": [
          "Number"
        ]
      },
      "dateObserved": {
        "types": [
          "DateTime"
        ]
      },
      "location": {
        "types": [
          "geo:json"
        ]
      },
      "relativeHumidity": {
        "types": [
          "Number"
        ]
      },
      "temperature": {
        "types": [
          "Number"
        ]
      }
    },
    "count": 1
  },
]
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```
200
```

### Input (type)

payload  *JSON Object*

When retrieving entity information for a given type, a `msg.payload` should contain a JSON Object with actionType `type` and an entity type.

A `msg.payload` should contain an Entity type and actionType with `type`.

```json
{
  "actionType": "type",
  "type": "Sensor"
}
```

### Output (type)

payload *JSON Object*

A `msg.payload` contains the entity information.

```json
{
  "attrs": {
    "TimeInstant": {
      "types": [
        "DateTime"
      ]
    },
    "atmosphericPressure": {
      "types": [
        "Number"
      ]
    },
    "dateObserved": {
      "types": [
        "DateTime"
      ]
    },
    "location": {
      "types": [
        "geo:json"
      ]
    },
    "relativeHumidity": {
      "types": [
        "Number"
      ]
    },
    "temperature": {
      "types": [
        "Number"
      ]
    }
  },
  "count": 1
}
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```
200
```