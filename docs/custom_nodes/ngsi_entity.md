# NGSI Entity

This custom node is a simple node that allows to obtain NGSIv2 entity.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity-02.png)

-   `name`: a name for a node instance
-   `Context Broker`: an endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Representation`: normalized or keyValues
-   `Entity type`: entity type to retrieve
-   `attributes`: list of attributes to retrieve
-   `Date Modified`: retrive attribute and metadata of dateModified

## Inputs

### Payload  *string or JSON Object*

A `msg.payload` should contain an entity Id to retrieves NGSI v2 entity.

```
urn:ngsi-ld:Building:store001
```


A `msg.payload` should contain a condition to retrieves NGSI v2 entity.

```
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
  "attrs": "humidity",
  "keyValues": true,
  "dateModified": false
}
```

## Outputs

### Payload *JSON Object*

A `msg.payload` contains NGSIv2 entity.

## Examples

### Input 1

```
E1
```

### Output 1

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

### Input 2

```
{
  "id": "E1",
  "type": "T",
  "attrs": "humidity",
  "keyValues": true
}
```

### Output 2

```
{
  "id": "E1",
  "type": "T",
  "humidity": 51
}
```
