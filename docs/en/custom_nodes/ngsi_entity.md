# NGSI entity

This custom node is a simple node that allows to create, read, upsert or delete an NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Create an entity](#create-an-entity)
-   [Read an entity](#read-an-entity)
-   [Upsert an entity](#upsert-an-entity)
-   [Delete an entity](#delete-an-entity)
-   [Use value of actionType in payload](#use-value-of-actiontype-in-payload)

</details>

## Create an entity

It allows to create a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `create`
-   `Representation`: normalized or keyValues

### Input

payload *JSON Object*

A `msg.payload` should contain an entity to create.

```json
{
  "id": "E",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-02-10T20:33:53.199Z"
      }
    }
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
201
```

## Read an entity

It allows to read a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `read`
-   `Entity id`: id of an entity to be read
-   `Entity type`: type of an entity to be read
-   `attributes`: list of attributes of an entity to be read
-   `Representation`: normalized or keyValues
-   `Date Modified`: retrieve attribute and metadata of dateModified

### Input

payload *string* or *JSON Object*

A `msg.payload` should contain an entity Id to read the NGSI v2 entity.

```text
urn:ngsi-ld:Building:store001
```

A `msg.payload` should contain a condition to read the NGSI v2 entity.

```json
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
  "attrs": "humidity",
  "keyValues": true,
  "dateModified": false
}
```

### Output

payload *JSON Object*

A `msg.payload` contains the NGSIv2 entity.

```json
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
}
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

## Upsert an entity

It allows to upsert a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `upsert`
-   `Representation`: normalized or keyValues

### Input

payload *JSON Object*

A `msg.payload` should contain an entity to upsert.

```json
{
  "id": "E",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-02-10T20:33:53.199Z"
      }
    }
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

## Delete an entity

It allows to delete a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`
-   `Entity id`: id of an entity to be deleted
-   `Entity type`: type of an entity to be deleted

### Input

payload *string* or *JSON Object*

A `msg.payload` should contain an entity Id to delete the NGSI v2 entity.

```text
urn:ngsi-ld:Building:store001
```

A `msg.payload` should contain a condition to delete the NGSI v2 entity.

```json
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Use value of actionType in payload

It allows to create, read, upsert or delete a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-06.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: Id of an entity to be created, read, upserted or deleted
-   `Entity type`: Type of an entity to be created, read, upserted or deleted
-   `Representation`: normalized or keyValues
-   `Date Modified`: retrieve attribute and metadata of dateModified

### Input (create)

payload *JSON Object*

When creating an entity, a `msg.payload` should contain a JSON Object with `actionType` and `entity`.

```json
{
  "actionType": "create",
  "entity": {
    "id": "E",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {
        "TimeInstant": {
          "type": "DateTime",
          "value": "2023-02-10T20:33:53.199Z"
        }
      }
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

### Output (create)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
201
```

### Input (read)

payload *JSON Object*

When reading an entity, a `msg.payload` should contain a JSON Object with `actionType` and related information the entity to be read.

```json
{
  "actionType": "read",
  "id": "E",
  "type": "T"
}
```

### Output (read)

payload *JSON Object*

A `msg.payload` contains an object representing the entity.

```json
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

#### Input (upsert)

payload *JSON Object*

When upserting an entity, a `msg.payload` should contain a JSON Object with `actionType` and `entity`.

```json
{
  "actionType": "upsert",
  "entity": {
    "id": "E",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 29,
      "metadata": {
        "TimeInstant": {
          "type": "DateTime",
          "value": "2023-02-10T20:33:53.199Z"
        }
      }
    },
    "relativeHumidity": {
      "type": "Number",
      "value": 58,
      "metadata": {}
    },
    "atmosphericPressure": {
      "type": "Number",
      "value": 1234.5,
      "metadata": {}
    }
  }
}
```

### Output (upsert)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (delete)

payload *JSON Object*

When deleting an entity, a `msg.payload` should contain a JSON Object with `actionType` and related information the entity to be deleted.

```json
{
  "actionType": "delete",
  "id": "E",
  "type": "T"
}
```

### Output (delete)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```