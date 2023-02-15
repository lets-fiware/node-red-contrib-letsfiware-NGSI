# NGSI types

このカスタム・ノードは、エンティティ タイプのリストまたは特定のタイプのエンティティ情報を取得できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [エンティティ・タイプの一覧表示](#list-entity-types)
-   [特定のタイプのエンティティ情報を取得](#retrieve-entity-information-for-a-given-type)

</details>

<a name="list-entity-types"></a>

## エンティティ・タイプの一覧表示

エンティティ・タイプのリストを取得できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images//types/types-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Entity type`: 空白にしてください
-   `Values`: true の場合、レスポンス・ペイロードは、エンティティ・タイプのリストを含む JSON 配列です。
-   `NoAttrDetail`: true の場合、リクエストは属性タイプの詳細を提供しません

### 例

#### 入力 

Payload *JSON Object*

`msg.payload` には、空の JSON オブジェクトが含まれている必要があります。

```
{}
```

#### 出力

Payload *JSON Array*

`msg.payload` には、エンティティ・タイプのリストが含まれています。

```
[
  {
    "type": "Sensor",
    "attrs": {
      "TimeInstant": {
        "types": [
          "DateTime"
        ]
      },
      "atmosphericPressure": {
        "types": [
          "Number"
        ]
      },
      "dateObserved": {
        "types": [
          "DateTime"
        ]
      },
      "location": {
        "types": [
          "geo:json"
        ]
      },
      "relativeHumidity": {
        "types": [
          "Number"
        ]
      },
      "temperature": {
        "types": [
          "Number"
        ]
      }
    },
    "count": 1
  },
]
```

<a name="retrieve-entity-information-for-a-given-type"></a>

## 特定のタイプのエンティティ情報を取得

特定のタイプのエンティティ情報を取得できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Entity type`: エンティティ情報を取得するエンティティのタイプ
-   `Values`: 無効
-   `NoAttrDetail`: true の場合、リクエストは属性タイプの詳細を提供しません

### 例

#### 入力

Payload  *String*

`msg.payload` には、エンティティ・タイプが含まれている必要があります。

```
Sensor
```

#### 出力

Payload *JSON Object*

`msg.payload` には、エンティティ情報が含まれます。

```
{
  "attrs": {
    "TimeInstant": {
      "types": [
        "DateTime"
      ]
    },
    "atmosphericPressure": {
      "types": [
        "Number"
      ]
    },
    "dateObserved": {
      "types": [
        "DateTime"
      ]
    },
    "location": {
      "types": [
        "geo:json"
      ]
    },
    "relativeHumidity": {
      "types": [
        "Number"
      ]
    },
    "temperature": {
      "types": [
        "Number"
      ]
    }
  },
  "count": 1
}
```
