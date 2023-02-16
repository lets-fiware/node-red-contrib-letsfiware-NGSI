# NGSI types

このカスタム・ノードは、エンティティ タイプのリストまたは特定のタイプのエンティティ情報を取得できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [エンティティ・タイプの一覧表示](#list-entity-types)
-   [特定のタイプのエンティティ情報を取得](#retrieve-entity-information-for-a-given-type)
-   [Payload 内の actionType の値を使用](#use-value-of-actiontype-in-payload)


</details>

<a name="list-entity-types"></a>

## エンティティ・タイプの一覧表示

エンティティ・タイプのリストを取得できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images//types/types-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `List Entity Types`
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

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entity information for a given type`
-   `Entity type`: エンティティ情報を取得するエンティティのタイプ
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

<a name="use-value-of-actiontype-in-payload"></a>

## Use value of actionType in payload

エンティティ・タイプのリストまたは特定のタイプのエンティティ情報を取得できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/types/types-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `value of actionType in payload`
-   `Entity type`: エンティティ情報を取得するエンティティのタイプ
-   `Values`: true の場合、レスポンス・ペイロードは、エンティティ・タイプのリストを含む JSON 配列です。
-   `NoAttrDetail`: true の場合、リクエストは属性タイプの詳細を提供しません

### 例

エンティティ・タイプのリストを取得する場合、`msg.payload` には、actionType `types` を持つ JSON オブジェクトが含まれている必要があります。

#### 入力

Payload *JSON Object*

`msg.payload` には、`types` の値を持つ actionType が含まれている必要があります。

```
{
  "actionType": "types"
}
```

#### Output

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

特定のタイプのエンティティ情報を取得する場合、 `msg.payload` には、actionType `type` とエンティティ・タイプを持つ JSON オブジェクトが含まれている必要があります。

#### Input

Payload  *JSON Object*

`msg.payload` には、エンティティ・タイプと `type` の値を持つ actionType が含まれている必要があります。

```
{
  "actionType": "type",
  "type": "Sensor"
}
```

#### Output

Payload *JSON Object*

`msg.payload` には、エンティティ情報が含まれています。

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