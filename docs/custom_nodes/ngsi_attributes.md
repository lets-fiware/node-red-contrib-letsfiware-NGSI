# NGSI attributes

This custom node is a simple node that allows to append, update, upsert or replace attributes of NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-01.png)

## Append attributes

It alows to append attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: append
-   `Entity id`: Entity id to retrieve  an attributes
-   `Entity type`: Entity type to retrieve an attributes
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain an object with the attributes.

```
{
  "temperature": {
    "type": "Number",
    "value": 17,
    "metadata": {}
  }
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

## Update attributes

It alows to update attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-03.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: update 
-   `Entity id`: Entity id to retrieve  an attributes
-   `Entity type`: Entity type to retrieve an attributes
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain an object with the attributes.

```
{
  "temperature": {
    "type": "Number",
    "value": 20,
    "metadata": {}
  }
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

## Upsert attributes

It alows to upsert attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-04.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: upsert
-   `Entity id`: Entity id to retrieve  an attributes
-   `Entity type`: Entity type to retrieve an attributes
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain an object with the attributes.

```
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

#### Output

Payload *null or string*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Replace attributes

It alows to replace attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-05.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: replace
-   `Entity id`: Entity id to retrieve  an attributes
-   `Entity type`: Entity type to retrieve an attributes
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain an object with the attributes.

```
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

It alows to append, update, upsert or replace attributes of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attributes-06.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: value of actionType in payload
-   `Entity id`: Entity id to retrieve  an attributes
-   `Entity type`: Entity type to retrieve an attributes
-   `Representation`: normalized or keyValues
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain a JSON Object with actionType and an object with the attributes.

```
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

```
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

```
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

```
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

#### Output

Payload *null or string*

A `msg.payload` contains a status code.

```
204
```

```
null
```