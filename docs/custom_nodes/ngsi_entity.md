# NGSI entity

This custom node is a simple node that allows to create, read, upsert or delete an NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-01.png)

## Create an entity

It alows to create a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images//entity/entity-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: create
-   `Representation`: normalized or keyValues

### Exmaple

#### Input

Payload *JSON Object*

A `msg.payload` should contain an entity to create.

```
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

#### Output

Payload *null or number*

A `msg.payload` contains a status code.

```
201
```

```
null
```

## Read an entity

It alows to read a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: Entity id to update an attributes
-   `Entity type`: Entity type to update an attributes
-   `attributes`: list of attributes to retrieve
-   `Representation`: normalized or keyValues
-   `Date Modified`: retrive attribute and metadata of dateModified

### Exmaples

#### Input

Payload  *string or JSON Object*

A `msg.payload` should contain an entity Id to read the NGSI v2 entity.

```
urn:ngsi-ld:Building:store001
```

A `msg.payload` should contain a condition to read the NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
  "attrs": "humidity",
  "keyValues": true,
  "dateModified": false
}
```

#### Output

Payload *JSON Object*

A `msg.payload` contains the NGSIv2 entity.

```
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

## Upsert an entity

It alows to upsert a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images//entity/entity-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: upsert
-   `Representation`: normalized or keyValues

### Exmaple

#### Input

Payload *JSON Object*

A `msg.payload` should contain an entity to upsert.

```
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

#### Output

Payload *null or number*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Delete an entity

It alows to delete a NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: delete
-   `Entity id`: Entity id to delete an attributes
-   `Entity type`: Entity type to delete an attributes

### Exmaple

#### Input

Payload  *string or JSON Object*

A `msg.payload` should contain an entity Id to delete the NGSI v2 entity.

```
urn:ngsi-ld:Building:store001
```

A `msg.payload` should contain a condition to delete the NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
  "attrs": "humidity",
  "keyValues": true,
  "dateModified": false
}
```

#### Output

Payload *null or string*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Use value of actionType in payload

It alows to read, update or delete an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-06.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: value of actionType in payload
-   `Entity id`: Entity id to read, update or delete an attribute
-   `Entity type`: Entity type to read, update or delete an attribute
-   `Representation`: normalized or keyValues
-   `Date Modified`: retrive attribute and metadata of dateModified

### Exmaple

#### Input

Payload  *JSON Object*

When creating an entity, A `msg.payload` should contain a JSON Object with `actionType` and `entity`.

```
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

When reading an entity, A `msg.payload` should contain a JSON Object with `actionType` and related information the entity to be read.

```
{
  "actionType": "read",
  "id": "E",
  "type": "T"
}
```

When upserting an entity, A `msg.payload` should contain a JSON Object with `actionType` and `entity`.

```
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

When deleting an entity, A `msg.payload` should contain a JSON Object with `actionType` and related information the entity to be deleted.

```
{
  "actionType": "delete",
  "id": "E",
  "type": "T"
}
```

#### Output

Payload *null or number*

When creating an entity, a `msg.payload` contains a status code.

```
201
```

```
null
```

Payload *JSON Object*

When reading an entity, a `msg.payload` contains an object representing the entity.

```
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

Payload *null or number*

When upserting and deleting an entity, a `msg.payload` contains a status code.

```
204
```

```
null
```
