# NGSI Subscription

This custom node is a simple node that allows to create, update or delete an NGSIv2 subscription.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription-01.png)

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription-02.png)

-   `name`:
-   `Context Broker`:
-   `ServicePath`:
-   `Entity types`:
-   `ID pattern`:
-   `Watched Attrs`:
-   `Query`:
-   `Notification Endpoint`:
-   `Attrs`:
-   `Attrs format`:

## Create a subscription

This operation allows to create a new subscription.

### Inputs *JSON Object*

A `msg.payload` contains a NGSIv2 subscription data.

### Outputs *JSON Object* or *null*

A `msg.payload` contains a subscription Id, a FIWARE Service and a FIWARE ServicePath.

### Examples

#### Input 1

```
{
  "type": "T",
  "idPattern": ".*",
  "watchedAttrs": "temperature,humidity",
  "q": "temperature>10",
  "url": "http://context-consumer",
  "attrs": "humidity",
  "description": "subscription for node-red",
  "expires": "2030-04-05T14:00:00.00Z",
  "throttling": 5
}
```

#### Output 1

```
{
  "id": "5fa7988a627088ba9b91b1c1",
  "service": "",
  "servicepath": ""
}
```

#### Input 2

```
{
  "description": "subscription for node-red",
  "notification": {
    "attrs": [
      "humidity"
    ],
    "http": {
      "url": "http://context-consumer"
    }
  },
  "subject": {
    "condition": {
      "attrs": [
        "temperature",
        "humidity"
      ],
      "expression": {
        "q": "temperature>10"
      }
    },
    "entities": [
      {
        "idPattern": ".*",
        "type": "T"
      }
    ]
  },
  "expires": "2030-04-05T14:00:00.00Z",
  "throttling": 5
}
```

#### Output 2

```
{
  "id": "5fa7988a627088ba9b91b1c1",
  "service": "openiot",
  "servicepath": "/"
}
```

## Update a subscription

This operation allows to update a existing subscription.

### Inputs *JSON Object*

A `msg.payload` contains a NGSIv2 subscription fragment with a subscription Id.

### Outputs *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

### Example

#### Input

```
{
  "id": "5fa7988a627088ba9b91b1c1",
  "expires": "2030-04-05T14:00:00.00Z"
}
```

#### Output

```
204
```

## Delete a subscription

This operation allows to delete a existing subscription.

### Inputs *JSON Object*

A `msg.payload` contains a subscription Id.

### Outputs *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

### Example

#### Input

```
{
  "id": "5fa7988a627088ba9b91b1c1"
}
```

#### Output

```
204
```
