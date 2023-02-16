# NGSI to dashboard

This custom node is a simple node that allows to transform context data to data for the dashboard node.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-01.png)

## Contents

<details>
<summary><strong>Details</strong></summary>

-   [Properties](#properties)
-   [Inputs / Outputs](#inputs--outputs)
    -   [NGSI Entity node](#ngsi-entity-node)
    -   [Notification](#notification)
    -   [Historical context node](#historical-context-node)

</details>

## Properties

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-02.png)

-   `name`: a name for a node instance
-   `Input type`: an input type: `Entity (normalized)`, `Notification` or `Historical context`
-   `Attributes`: list of attributes
-   `Name to replace`: list of names to replace attribute names

## Inputs / Outputs

### NGSI Entity node

#### input

If you want to transform context data received form NGSI Entity node, set `Entity (normalized)` to Input type.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-03.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-04.png)

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "type": "Sensor",
  "relativeHumidity": {
    "type": "Number",
    "value": 32,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-01-28T04:53:13.301Z"
      }
    }
  },
  "temperature": {
    "type": "Number",
    "value": 22.4,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-01-28T04:53:13.301Z"
      }
    }
  }
}
```

#### Output

A msg contains data for the dashboard node.

```
{ "payload": 22.4, "topic": "temperature", "timestamp": 1674881593301 }
{ "payload": 32, "topic": "relativeHumidity", "timestamp": 1674881593301 }
```

### Notification

#### input

If you want to transform notification data received from Orion Context Broker, set `Notification` to Input type.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-05.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-06.png)

```
{
  "subscriptionId": "57edf55231cee478fe9fff1f",
  "data": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:sensor001",
      "type": "Sensor",
      "relativeHumidity": {
        "type": "Number",
        "value": 32,
        "metadata": {
          "dateModified": {
            "type": "DateTime",
            "value": "2023-01-28T04:53:13.301Z"
          }
        }
      },
      "temperature": {
        "type": "Number",
        "value": 22.4,
        "metadata": {
          "dateModified": {
            "type": "DateTime",
            "value": "2023-01-28T04:53:13.301Z"
          }
        }
      }
    }
  ]
}
```

#### Output

A msg contains data for the dashboard node.
      
```
{ "payload": 22.4, "topic": "temperature", "timestamp": 1674881593301 }
{ "payload": 32, "topic": "relativeHumidity", "timestamp": 1674881593301 }
```

### Historical context node

#### input

If you want to transform historical context data received form Historical context node, set `Historical` to Input type.

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-07.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard-08.png)

```
{
  "attrName": "temperature",
  "dataType": "raw",
  "type": "StructuredValue",
  "value": [
    {
      "_id": "63d45c3587f5b27f576ed498",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 22.2,
      "recvTime": "2023-01-27T23:20:21.201Z"
    },
    {
      "_id": "63d45c3787f5b27f576ed49e",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 22.2,
      "recvTime": "2023-01-27T23:20:23.199Z"
    },
    {
      "_id": "63d45c3987f5b27f576ed4a4",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 22.2,
      "recvTime": "2023-01-27T23:20:25.201Z"
    }
  ]
}
```

#### Output

A msg contains data for the dashboard node.

```
[
  {
    "series": [
      "temperature"
    ],
    "labels": [],
    "data": [
      [
        {
          "x": 1674861621201,
          "y": 22.2
        },
        {
          "x": 1674861623199,
          "y": 22.2
        },
        {
          "x": 1674861625201,
          "y": 22.2
        }
      ]
    ]
  }
]
```
