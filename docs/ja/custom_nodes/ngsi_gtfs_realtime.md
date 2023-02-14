# GTFS realtime to NGSI

このカスタム・ノードは、GTFS realtime データを NGSIv2 エンティティに変換できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/gtfs-realtime/gtfs-realtime-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [入力](#input)
-   [出力](#output)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/gtfs-realtime/gtfs-realtime-02.png)

- `name`: ノード・インスタンスの名前

<a name="input"></a>

## 入力

Payload *string* または *JSON Array*

`msg.payload`には、GTFS realtime データを提供するエンドポイントの URL または、GTFS realtime データを含める必要があります。
GTFS realtime データを含む JSON オブジェクトが提供される場合、JSON 配列に自動的に変換されます。

### 入力 (*string*)

```
https://gtfs.letsfiware.jp/gtfs-realtime/vehicle-position.bin
```

### 入力 (*JSON Array*)

```
[
  {
    "id": "bus01",
    "vehicle": {
      "trip": {
        "tripId": "00000000000000000000000000000000",
        "startDate": "20220301",
        "scheduleRelationship": "SCHEDULED",
        "routeId": "001"
      },
      "position": {
        "latitude": 35.1,
        "longitude": 135.2,
        "bearing": 180.3
      },
      "currentStopSequence": 1,
      "currentStatus": "IN_TRANSIT_TO",
      "timestamp": "0000000001",
      "stopId": "S0001",
      "vehicle": {
        "id": "bus01"
      }
    }
  }
]
```

<a name="output"></a>

## 出力

### Payload *JSON Array*

`msg.payload` には、NGSIv2 エンティティが含まれます。

### 出力

```
[
  {
    "type": "Vehicle",
    "id": "urn:ngsi-ld:Vehicle:bus01",
    "currentStatus": {
      "type": "Text",
      "value": "IN_TRANSIT_TO"
    },
    "currentStopSequence": {
      "type": "Number",
      "value": 1
    },
    "location": {
      "type": "geo:json",
      "value": {
        "coordinates": [
          135.2,
          35.1
        ],
        "type": "Point"
      }
    },
    "position": {
      "type": "StructuredValues",
      "value": {
        "bearing": 180.3,
        "latitude": 35.1,
        "longitude": 135.2
      }
    },
    "stopId": {
      "type": "Text",
      "value": "S0001"
    },
    "timestamp": {
      "type": "Text",
      "value": "0000000001"
    },
    "trip": {
      "type": "StructuredValues",
      "value": {
        "routeId": "001",
        "scheduleRelationship": "SCHEDULED",
        "startDate": "20220301",
        "tripId": "00000000000000000000000000000000"
      }
    },
    "vehicle": {
      "type": "StructuredValues",
      "value": {
        "id": "bus01"
      }
    }
  }
]
```
