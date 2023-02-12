# NGSI Attribute value

This custom node is a simple node that allows to read or update an attribute value of NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value/attribute-value-01.png)

## Read attribute value

It alows to read an attribute value of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value/attribute-value-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: Entity id to read an attribute value
-   `Entity type`: Entity type to read an attribute value
-   `Attribute name`: Attribute name to read an attribute value
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers

### Example

#### Input

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity.

The following payload uses value of each property.

```
{}
```

The following payload overwrites value of each property.

```
{
  "id": "urn:ngsi-ld:attr-value",
  "type: "T",
  "attrName": "test",
  "skipForwarding": true
}
```

#### Output

Payload *null, boolean, number, string or JSON Object*

A `msg.payload` contains an attribute value.

## Update attribute value

It alows to update an attribute value of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value/attribute-value-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: update
-   `Entity id`: Entity id to update an attribute value
-   `Entity type`: Entity type to update an attribute value
-   `Attribute name`: Attribute name to update an attribute value
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Example

#### Input

Payload *null, boolean, number, string or JSON Object*

A `msg.payload` should contain an attribute value.

```
null
```

```
true
```

```
123
```

```
abc
```

```
{
  "abc": 123
}
```

```
["abc", 123]
```

### Output

Payload *null or string*

A `msg.payload` contains a status code.

```
204
```

```
null
```

## Use value of actionType in payload

It alows to read or update an attribute value of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value/attribute-value-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: value of actionType in payload
-   `Entity id`: Entity id to read or update an attribute value
-   `Entity type`: Entity type to read or update an attribute value
-   `Attribute name`: Attribute name to read or update an attribute value
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Examples

#### Input 1

Payload  *JSON Object*

The following payload overwrites value of each property.

```
{
  "actionType": "read",
  "id": "urn:ngsi-ld:attr-value",
  "type: "T",
  "attrName": "test",
  "skipForwarding": true
}
```

#### Output 1

Payload *null, boolean, number, string or JSON Object*

A `msg.payload` contains an attribute value.

#### Input 2

Payload *JSON Object*

A `msg.payload` should contain an attribute value with related information.
It overwrites value of each property.

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": null
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": false
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": 123
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": "abc"
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": {
    "abc": 123
  }
}
```

```
{
  "actionType": "update",
  "id": "urn:ngsi-ld:attr-value",
  "type": "T",
  "attrName": "test",
  "value": ["abc", 123]
}
```

### Output 2

Payload *null or number*

A `msg.payload` contains a status code.

```
204
```

```
null
```
