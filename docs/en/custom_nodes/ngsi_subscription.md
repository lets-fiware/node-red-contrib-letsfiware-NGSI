# NGSI Subscription

This custom node is a simple node that allows to create, update or delete an NGSIv2 subscription.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-01.png)

## Contents

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

### Input

payload *JSON Object*

A `msg.payload` should contain a NGSIv2 subscription data.

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

### Output

payload *String*

A `msg.payload` contains a subscription id.

```text
5fa7988a627088ba9b91b1c1
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
201
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

### Input

payload *JSON Object*

A `msg.payload` should contain a NGSIv2 subscription fragment with a subscription id.

```json
{
  "id": "5fa7988a627088ba9b91b1c1",
  "expires": "2030-04-05T14:00:00.00Z"
}
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Delete a subscription

This operation allows to delete a existing subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-04.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`

### Input

payload *String*

A `msg.payload` should contain a subscription id.

```text
5fa7988a627088ba9b91b1c1
```

### Output

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

## Use value of actionType in payload

This operation allows to create, update or delete a subscription.

### Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/subscription/subscription-05.png)

-   `name`: A name for a node instance
-   `Context Broker`: An endpoint of a context broker
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`


### Input (create)

payload *JSON Object*

When creating a new subscription, a `msg.payload` should contain a JSON Object with actionType and subscription data.

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

### Output (create)

payload *String*

A `msg.payload` contains a subscription id.

```text
5fa7988a627088ba9b91b1c1
```

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
201
```

### Input (update)

payload *JSON Object*

When updating a existing subscription, a `msg.payload` should contain a JSON Object with actionType, subscription id and subscription data.

```json
{
  "actionType": "update",
  "id": "63ea11e4a0cec98fc6017aae",
  "subscription": {
    "expires": "2030-04-05T14:00:00.00Z"
  }
}
```

### Output (update)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```

### Input (delete)

payload *JSON Object*

When deleting a existing subscription, a `msg.payload` should contain a JSON Object with actionType and subscription id.

```json
{
  "actionType": "delete",
  "id": "63ea11e4a0cec98fc6017aae"
}
```

### Output (delete)

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
204
```