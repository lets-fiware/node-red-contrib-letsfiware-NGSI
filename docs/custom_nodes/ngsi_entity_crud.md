# NGSI Entity CRUD

This custom node is a simple node that allows to create, read, upsert or delete NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-crud-01.png)

## Create entity

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-crud-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: create
-   `Representation`: normalized or keyValues

### Examples

#### Input 1

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Device:device001",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25
  }
}
```

#### Output 1

Payload *string*

A `msg.payload` contains a status code.

```
201
```

#### Input 2

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity with actionType.

```
{
  "actionType": "create",
  "entity": {
    "id": "urn:ngsi-ld:Device:device001",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 25
    }
  },
  "keyValues": false
}
```

#### Output 2

Payload *string*

A `msg.payload` contains a status code.

```
201
```

## Read entity

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-crud-03.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: entity id to retrieve
-   `Entity type`: entity type to retrieve
-   `Representation`: normalized or keyValues

### Examples

#### Input 1

Payload  *JSON Object*

A `msg.payload` should contain an entity Id to retrieve NGSI v2 entity.

```
urn:ngsi-ld:Device:device001
```

### Output 1

Payload  *JSON Object*

A `msg.payload` contains a NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Device:device001",
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

### Input 2

Payload  *JSON Object*

A `msg.payload` should contain an entity Id with actionType to retrieve NGSI v2 entity.

```
{
  "actionType": "read",
  "id": "urn:ngsi-ld:Device:device001",
  "type": "T",
  "keyValues": true
}
```

### Output 2

Payload  *JSON Object*

A `msg.payload` contains a NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Device:device001",
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

## Upsert entity

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-crud-04.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: upsert
-   `Representation`: normalized or keyValues

### Examples

#### Input 1

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Device:device001",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25
  }
}
```

#### Output 1

Payload *string*

A `msg.payload` contains a status code.

```
204
```

#### Input 2

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity with actionType.

```
{
  "actionType": "upsert",
  "entity": {
    "id": "urn:ngsi-ld:Device:device001",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 25
    }
  },
  "keyValues": false
}
```

#### Output 2

Payload *string*

A `msg.payload` contains a status code.

```
204
```

## Delete entity

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-crud-05.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: delete
-   `Entity id`: entity id to delete
-   `Entity type`: entity type to delete

#### Input 1

Payload  *JSON Object*

A `msg.payload` should contain an entity Id to delete NGSI v2 entity.

```
urn:ngsi-ld:Device:device001
```

#### Output 1

Payload  *string*

A `msg.payload` contains a status code.

```
204
```

#### Input 2

Payload  *JSON Object*

A `msg.payload` should contain an entity Id with actionType to delete NGSI v2 entity.

```
{
  "actionType": "delete",
  "id": "urn:ngsi-ld:Device:device001",
  "type": "T"
}
```

#### Output 2

Payload  *string*

A `msg.payload` contains a status code.

```
204
```
