# NGSI Attribute value

This custom node is a simple node that allows to read or upsert an attribute value of NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value-01.png)

## Read attribute value

It alows to read an attribute value of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: Entity id to retrieve  an attribute value
-   `Entity type`: Entity type to retrieve an attribute value
-   `Attribute name`: Attribute name to retrieve an attribute value
-   `Skip forwarding`: If true, Context Broker skips forwarding to Context Providers

### Examples

#### Input

Payload  *JSON Object*

A `msg.payload` should contain a NGSI v2 entity.

The following payload uses value of each property.

```
{}
```

The following payload overwrites value of each property except actionType.

```
{
  "id": "urn:ngsi-ld:attr-value",
  "type: "T",
  "attrName": "test",
  "skipForwarding": true
}
```

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

#### Output

Payload *null, boolean, number, string or JSON Object*

A `msg.payload` contains an attribute value.

## Update attribute value

It alows to update an attribute value of NGSIv2 entity.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/attribute-value-03.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: read
-   `Entity id`: Entity id to retrieve  an attribute value
-   `Entity type`: Entity type to retrieve an attribute value
-   `Attribute name`: Attribute name to retrieve an attribute value
-   `Forced update`: If true, it triggers matching subscriptions
-   `Flow control`: If true, it enables flow control mechanism

### Examples

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

### Output 1

Payload *null or string*

A `msg.payload` contains a status code.

```
204
```

```
null
```
