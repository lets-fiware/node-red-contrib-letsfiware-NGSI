# NGSI Subscription

This custom node is a simple node that allows to create, update or delete an NGSIv2 subscription.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-01.png)

<details>
<summary><strong>Details</strong></summary>

-   [Create a subscription](#create-a-subscription)
-   [Update a subscription](#update-a-subscription)
-   [Delete a subscription](#delete-a-subscription)
-   [Use value of actionType in payload](#use-value-of-actiontype-in-payload)

</details>

## Create a subscription

This operation allows to create a new subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-02.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `create`
-   `Entity type`: Type of the affected entity
-   `ID pattern`: Id pattern of the affected entity
-   `Watched Attrs`: list of attribute names that will trigger the notification
-   `Query`: A query expression, composed of a list of statements separated by `;`
-   `Notification Endpoint`: URL referencing the service to be invoked when a notification is generated
-   `Attrs`: List of attributes to be included in notification messages
-   `Attrs format`: Specify how the entities are represented in notifications


### Examples

#### Input

Payload *JSON Object*

A `msg.payload` contains a NGSIv2 subscription data.

```json
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

```json
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

#### Output

Payload  *string*

A `msg.payload` contains a subscription id.

```text
5fa7988a627088ba9b91b1c1
```

## Update a subscription

This operation allows to update a existing subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-03.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `update`
-   `Entity type`: Type of the affected entity
-   `ID pattern`: Id pattern of the affected entity
-   `Watched Attrs`: list of attribute names that will trigger the notification
-   `Query`: A query expression, composed of a list of statements separated by `;`
-   `Notification Endpoint`: URL referencing the service to be invoked when a notification is generated
-   `Attrs`: List of attributes to be included in notification messages
-   `Attrs format`: Specify how the entities are represented in notifications

### Example

#### Input

Payload *JSON Object*

A `msg.payload` contains a NGSIv2 subscription fragment with a subscription id.

```
{
  "id": "5fa7988a627088ba9b91b1c1",
  "expires": "2030-04-05T14:00:00.00Z"
}
```

#### Output

Payload *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

```text
204
```

```text
null
```

## Delete a subscription

This operation allows to delete a existing subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### Example

#### Input

Payload *string*

A `msg.payload` contains a subscription id.

```
5fa7988a627088ba9b91b1c1
```

#### Output

Payload *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

```
204
```

```
null
```

## Use value of actionType in payload

This operation allows to create, update or delete a subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### Example

When creating a new subscription, A `msg.payload` should contain a JSON Object with actionType and subscription data.

#### Input

```json
{
  "actionType": "create",
  "subscription": {
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
}
```

#### Output

Payload  *string*

A `msg.payload` contains a subscription id.

```text
5fa7988a627088ba9b91b1c1
```

When updating a existing subscription, A `msg.payload` should contain a JSON Object with actionType, subscription id and subscription data.

#### Input

```json
{
  "actionType": "update",
  "id": "63ea11e4a0cec98fc6017aae",
  "subscription": {
    "expires": "2030-04-05T14:00:00.00Z"
  }
}
```

#### Output

Payload *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

```
204
```

```
null
```

When deleting a existing subscription, A `msg.payload` should contain a JSON Object with actionType and subscription id.

#### Input

```json
{
  "actionType": "delete",
  "id": "63ea11e4a0cec98fc6017aae"
}
```

#### Output

Payload *Number* or *null*

A `msg.payload` contains `204` (as Number) or null.

```
204
```

```
null
```
