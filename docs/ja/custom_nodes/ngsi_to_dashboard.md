# NGSI to dashboard

このカスタム・ノードは、コンテキスト・データを Dashboard node のデータに変換できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [入力 / 出力](#inputs--outputs)
    -   [NGSI Entity node](#ngsi-entity-node)
    -   [Notification](#notification)
    -   [Historical context node](#historical-context-node)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-02.png)

-   `name`: ノード・インスタンスの名前
-   `Input type`: 入力データのタイプ: `Entity (normalized)`, `Notification` または `Historical context`
-   `Attributes`: 属性のリスト
-   `Name to replace`: 属性名を置き換える名前のリスト

<a name="inputs--outputs"></a>

## 入力 / 出力

<a name="ngsi-entity-node"></a>

### NGSI Entity node

#### 入力

NGSI Entity ノードから受け取ったコンテキスト・データを変換する場合は、`Input type` に `Entity (normalized)` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-03.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-04.png)

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

#### 出力

msg には、Dashboard node 向けのデータが含まれています。

```
{ "payload": 22.4, "topic": "temperature", "timestamp": 1674881593301 }
{ "payload": 32, "topic": "relativeHumidity", "timestamp": 1674881593301 }
```

<a name="notification"></a>

### Notification

#### 入力

Orion Context Broker から受信した通知データを変換する場合は、`Input type` に `Notification` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-05.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-06.png)

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

#### 出力

msg には、Dashboard node 向けのデータが含まれています。
      
```
{ "payload": 22.4, "topic": "temperature", "timestamp": 1674881593301 }
{ "payload": 32, "topic": "relativeHumidity", "timestamp": 1674881593301 }
```

<a name="historical-context-node"></a>

### Historical context node

#### input

Historical context node から受信した履歴コンテキスト・データを変換する場合は、`Input type` に `Historical` を設定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-07.png)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/ngsi-to-dashboard/ngsi-to-dashboard-08.png)

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

#### 出力

msg には、Dashboard node 向けのデータが含まれています。

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
