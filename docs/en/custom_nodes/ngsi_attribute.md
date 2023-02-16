# NGSI attribute

This custom node is a simple node that allows to read, update or delete an attribute in NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Read an attribute](#read-an-attribute)
-   [Update an attribute](#update-an-attribute)
-   [Delete an attribute](#delete-an-attribute)
-   [Use value of actionType in payload](#use-value-of-actionType-in-payload)

</details>

## Read an attribute

It allows to read an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `read`
-   `Entity id`: Id of an entity containing an attribute to be read
-   `Entity type`: Type of an entity containing an attribute to be read
-   `Attribute name`: Attribute name of an attribute to be read
-   `Metadata`: List of metadata names
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers

### Example

#### Input

Payload *JSON Object*

A `msg.payload` should contain information related to the attribute to read.

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

It allows to update an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity id`: Id of an entity containing an attribute to be updated
-   `Entity type`: Type of an entity containing an attribute to be updated
-   `Attribute name`: Attribute name of an attribute to be updated
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Example

#### Input

Payload *JSON Object*

A `msg.payload` should contain an object representing the attribute to update.

```
{
  "type": "Number",
  "value": 1234.5
}
```

#### Output

Payload *Number* or *null*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Delete an attribute

It allows to delete an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`
-   `Entity id`: Id of an entity containing an attribute to be deleted
-   `Entity type`: Type of an entity containing an attribute to be delete
-   `Attribute name`: Attribute name of an attribute to be deleted

### Example

#### Input

Payload *JSON Object*

A `msg.payload` should contain information related to the attribute to delete.

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

Payload *Number* or *null*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Use value of actionType in payload

It allows to read, update or delete an attribute in NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: Id of an entity containing an attribute to be read, updated or delete
-   `Entity type`: Type of an entity containing an attribute to be read, updated or delete
-   `Attribute name`: Attribute name of an attribute to be read, updated or delete
-   `Metadata`: List of metadata names
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers
-   `Override metadata`: If true, it replaces the existing metadata
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Examples

When reading an attribute, a `msg.payload` should contain a JSON Object with `actionType` and related information the attribute to be read.

#### Input 1

Payload *JSON Object*

```
{
  "actionType": "read",
  "attrName": "relativeHumidity"
}
```

#### Output 1

Payload *JSON Object*

A `msg.payload` contains an object representing the attribute.

```
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

When updating an attribute, a `msg.payload` should contain a JSON Object with `actionType` and `attribute` with related information the attribute to be updated.

#### Input 2

Payload *JSON Object*

```
{
  "actionType": "update",
  "attribute": {
    "type": "Number",
    "value": 1234.5
  }
}
```

#### Output 2

Payload *Number* or *null*

A `msg.payload` contains a status code.

```
204
```

```
null
```

When deleting an attribute, a `msg.payload` should contain a JSON Object with `actionType` and related information the attribute to be deleted.

#### Input 3

Payload *JSON Object*

```
{
  "actionType": "delete",
  "attrName": "relativeHumidity"
}
```

#### Output 3

Payload *JSON Object*

Payload *Number* or *null*

A `msg.payload` contains a status code.

```
204
```

```
null
```
