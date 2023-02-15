# NGSI types

This custom node is a simple node that allows to retrieve a list of entity types or entity information for a given type.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [List Entity Types](#list-entity-types)
-   [Retrieve entity information for a given type](#retrieve-entity-information-for-a-given-type)

</details>

## List Entity Types

It allows to retrieve a list of entity types.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images//types/types-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Entity type`: Keep blank
-   `Values`: If true, the response payload is a JSON array with a list of entity types
-   `NoAttrDetail`: If true, the request does not provide attribute type details

### Example

#### Input

Payload *JSON Object*

A `msg.payload` should contain an empty JSON Object.

```
{}
```

#### Output

Payload *JSON Array*

A `msg.payload` contains a list of entity types.

```
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

## Retrieve entity information for a given type

It allows to retrieve entity information for a given type.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Entity type`: Type of Entity to retrieve an entity information
-   `Values`: No effect
-   `NoAttrDetail`: If true, the request does not provide attribute type details

### Examples

#### Input

Payload  *String*

A `msg.payload` should contain an Entity type.

```
Sensor
```

#### Output

Payload *JSON Object*

A `msg.payload` contains the entity information.

```
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
