# NGSI attribute

This custom node is a simple node that allows to read, update or delete an attribute in NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-01.png)

## Read an attribute

It alows to read an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: Entity id to read an attribute
-   `Entity type`: Entity type to read an attribute
-   `Attribute name`: Name of attribute name to read 
-   `Metadata`: List of metadata names
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers

### Exmaple

#### Input

Payload *JSON Object*

A `msg.payload` should contain information related to the attribute to be read.

```
{}
```

```
{
  "attrName": "relativeHumidity"
}
```

```
{
  "id": "E",
  "type": "T",
  "attrName": "relativeHumidity"
}
```

#### Output

Payload *JSON Object*

A `msg.payload` contains an object representing the attribute.

```
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

## Update an attribute

It alows to update an attributes in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: update 
-   `Entity id`: Entity id to update an attributes
-   `Entity type`: Entity type to update an attributes
-   `Attribute name`: Name of attribute name to update
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain an object representing the attribute to be updated.

```
{
  "type": "Number",
  "value": 1234.5
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

## Delete an attribute

It alows to delete an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: upsert
-   `Entity id`: Entity id to delete an attributes
-   `Entity type`: Entity type to delete an attributes
-   `Attribute name`: Name of attribute name to delete

### Exmaple

#### Input

Payload  *JSON Object*

A `msg.payload` should contain information related to the attribute to be deleted.

```
{}
```

```
{
  "attrName": "relativeHumidity"
}
```

```
{
  "id": "E",
  "type": "T",
  "attrName": "relativeHumidity"
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

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: value of actionType in payload
-   `Entity id`: Entity id to read, update or delete an attribute
-   `Entity type`: Entity type to read, update or delete an attribute
-   `Attribute name`: Name of attribute name to read, update or delete
-   `Metadata`: List of metadata names
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers
-   `Override metadata`: If true, replace the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Exmaple

#### Input

Payload  *JSON Object*

When reading an attribute, A `msg.payload` should contain a JSON Object with `actionType` and related information the attribute to be read.

```
{
  "actionType": "read",
  "attrName": "relativeHumidity"
}
```

When updating an attribute, A `msg.payload` should contain a JSON Object with `actionType` and `attribute`.

```
{
  "actionType": "update",
  "attribute": {
    "type": "Number",
    "value": 1234.5
  }
}
```

When deleting an attribute, A `msg.payload` should contain a JSON Object with `actionType` and related information the attribute to be deleted.

```
{
  "actionType": "read",
  "attrName": "relativeHumidity"
}
```

#### Output

Payload *JSON Object*

When reading the attribute, a `msg.payload` contains an object representing the attribute.

```
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

Payload *null or number*

When updating and deleting an attribute, a `msg.payload` contains a status code.

```
204
```

```
null
```
