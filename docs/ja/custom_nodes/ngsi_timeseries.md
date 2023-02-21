# NGSI timeseries

このカスタム・ノードは、Quantumleap から時系列コンテキストを取得できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [Entities](#entities)
-   [Entity](#entity)
-   [Type](#type)
-   [Attribute](#attribute)
-   [API reference](#api-reference)

</details>

<a name="entities"></a>

## Entities

利用可能なすべてのエンティティ id を一覧表示できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-02.png)

-   `name`: ノード・インスタンスの名前
-   `Quantumpleap`: Quantumpleap のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entities`
-   `Entity type`: エンティティのタイプ
-   `form Date`: コンテキスト情報がクエリされる開始日時 (包括的)
-   `Unit for date`: 開始日時の単位
-   `to Date`: コンテキスト情報がクエリされる最終日時 (包括的)
-   `Unit for date`: 終了日時の単位
-   `Limit`: 1回のレスポンスで取得する結果の最大数
-   `Offset`: レスポンス結果に適用するオフセット

### 例

#### 入力

```
{}
```

#### 出力

```
[
  {
    "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
    "timeseriesType": "Sensor",
    "index": "2023-02-19T10:37:15.797+00:00"
  }
]
```

<a name="entity"></a>

## Entity

特定のエンティティの属性 (値のみ) の履歴をクエリできます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-03.png)

-   `name`: ノード・インスタンスの名前
-   `Quantumpleap`: Quantumpleap のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Entity`
-   `Value`: True の場合、値のみ
-   `Entity id`: エンティティの id
-   `Entity type`: エンティティのタイプ
-   `Attribute name`: 属性名
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: リクエスト条件を満たす最後の N 個の値のみをリクエストするために使用
-   `form Date`: コンテキスト情報がクエリされる開始日時 (包括的)
-   `Unit for date`: 開始日時の単位
-   `to Date`: コンテキスト情報がクエリされる最終日時 (包括的)
-   `Unit for date`: 終了日時の単位
-   `Georel`: 一致するエンティティと参照形状 (ジオメトリ) の間の空間関係を指定
-   `Geometry`: 地理的なクエリに使用する参照形状を指定
-   `Coords`: WGS 84 座標で参照形状 (ジオメトリ) を指定
-   `Limit`: 1回のレスポンスで取得する結果の最大数
-   `Offset`: レスポンス結果に適用するオフセット

### 例: Entity attributes

特定のエンティティの N 個の属性の履歴をクエリできます。

#### 入力

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "lastN": 3
}
```

#### 出力

```
{
  "attributes": [
    {
      "attrName": "atmosphericPressure",
      "values": [
        1005.3,
        1005.3,
        1005.3
      ]
    },
    {
      "attrName": "relativeHumidity",
      "values": [
        49.7,
        49.7,
        49.7
      ]
    },
    {
      "attrName": "temperature",
      "values": [
        19.8,
        19.9,
        19.8
      ]
    }
  ],
  "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
  "timeseriesType": "Sensor",
  "index": [
    "2023-02-19T10:38:51.841+00:00",
    "2023-02-19T10:38:53.842+00:00",
    "2023-02-19T10:38:55.845+00:00"
  ]
}
```

### 例: Entity attributes value

特定のエンティティの N 個の属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "value": true,
  "lastN": 3
}
```

#### 出力

```
{
  "attributes": [
    {
      "attrName": "atmosphericPressure",
      "values": [
        1005.3,
        1005.3,
        1005.3
      ]
    },
    {
      "attrName": "relativeHumidity",
      "values": [
        49.7,
        49.6,
        49.7
      ]
    },
    {
      "attrName": "temperature",
      "values": [
        19.8,
        19.9,
        19.9
      ]
    }
  ],
  "index": [
    "2023-02-19T10:40:35.897+00:00",
    "2023-02-19T10:40:37.910+00:00",
    "2023-02-19T10:40:39.911+00:00"
  ]
}
```

### 例: Entity attribute

特定のエンティティの属性の履歴をクエリできます。

#### 入力

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "attrName": "temperature",
  "lastN": 3
}
```

#### 出力

```
{
  "attrName": "temperature",
  "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
  "timeseriesType": "Sensor",
  "index": [
    "2023-02-19T10:41:00.000+00:00",
    "2023-02-19T10:42:00.000+00:00",
    "2023-02-19T10:43:00.000+00:00"
  ],
  "values": [
    19.8899995803833,
    19.89333292643229,
    19.895832935969036
  ]
}
```

### 例: Entity attribute value

特定のエンティティの属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "id": "urn:ngsi-ld:WeatherObserved:sensor001",
  "attrName": "temperature",
  "value": true,
  "lastN": 3
}
```

#### 出力

```
{
  "index": [
    "2023-02-19T10:43:00.000+00:00",
    "2023-02-19T10:44:00.000+00:00",
    "2023-02-19T10:45:00.000+00:00"
  ],
  "values": [
    19.896551329514075,
    19.896666272481283,
    19.899999618530273
  ]
}
```

<a name="type"></a>

## Type

同じタイプの N 個のエンティティの属性 (値のみ) の履歴をクエリできます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-04.png)

-   `name`: ノード・インスタンスの名前
-   `Quantumpleap`: Quantumpleap のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Type`
-   `Value`: True の場合、値のみ
-   `Entity id`: エンティティの id
-   `Entity type`: エンティティのタイプ
-   `Attribute name`: 属性名
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: リクエスト条件を満たす最後の N 個の値のみをリクエストするために使用
-   `form Date`: コンテキスト情報がクエリされる開始日時 (包括的)
-   `Unit for date`: 開始日時の単位
-   `to Date`: コンテキスト情報がクエリされる最終日時 (包括的)
-   `Unit for date`: 終了日時の単位
-   `Georel`: 一致するエンティティと参照形状 (ジオメトリ) の間の空間関係を指定
-   `Geometry`: 地理的なクエリに使用する参照形状を指定
-   `Coords`: WGS 84 座標で参照形状 (ジオメトリ) を指定
-   `Limit`: 1回のレスポンスで取得する結果の最大数
-   `Offset`: レスポンス結果に適用するオフセット

### 例: Type entity

同じタイプの N 個のエンティティの N 個の属性の履歴をクエリできます。

#### 入力

```
{
  "type": "Sensor",
  "lastN": 3
}
```

#### 出力

```
{
  "entities": [
    {
      "attributes": [
        {
          "attrName": "atmosphericPressure",
          "values": [
            1005.2,
            1005.3,
            1005.3
          ]
        },
        {
          "attrName": "relativeHumidity",
          "values": [
            49.5,
            49.6,
            49.5
          ]
        },
        {
          "attrName": "temperature",
          "values": [
            19.9,
            19.9,
            19.9
          ]
        }
      ],
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-19T10:47:56.116+00:00",
        "2023-02-19T10:47:58.119+00:00",
        "2023-02-19T10:48:00.118+00:00"
      ]
    }
  ],
  "timeseriesType": "Sensor"
}
```

### 例: Type entity value

同じタイプの N 個のエンティティの N 個の属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "type": "Sensor",
  "lastN": 3,
  "value": true
}
```

#### 出力

```
{
  "values": [
    {
      "attributes": [
        {
          "attrName": "atmosphericPressure",
          "values": [
            1021.5,
            1021.5,
            1021.5
          ]
        },
        {
          "attrName": "relativeHumidity",
          "values": [
            30.8,
            30.8,
            30.8
          ]
        },
        {
          "attrName": "temperature",
          "values": [
            17.8,
            17.8,
            17.8
          ]
        }
      ],
      "entityId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-21T07:47:25.616+00:00",
        "2023-02-21T07:47:27.613+00:00",
        "2023-02-21T07:47:29.616+00:00"
      ]
    }
  ]
}
```

### 例: Type attribute

同じタイプの N 個のエンティティの属性の履歴をクエリできます。

#### 入力

```
{
  "type": "Sensor",
  "attrName": "temperature",
  "lastN": 3
}
```

#### 出力

```
{
  "attrName": "temperature",
  "entities": [
    {
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-01T00:00:00.000+00:00"
      ],
      "values": [
        104122.2
      ]
    }
  ],
  "timeseriesType": "Sensor"
}
```

### 例: Type attribute value

同じタイプの N 個のエンティティの属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "type": "Sensor",
  "attrName": "temperature",
  "lastN": 3,
  "value": true
}
```

#### 出力

```
{
  "values": [
    {
      "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
      "index": [
        "2023-02-01T00:00:00.000+00:00"
      ],
      "values": [
        104719.2
      ]
    }
  ]
}
```

<a name="attribute"></a>

## Attributes

N タイプの N エンティティの N 属性 (値のみ) の履歴をクエリできます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/timeseries/timeseries-05.png)

-   `name`: ノード・インスタンスの名前
-   `Quantumpleap`: Quantumpleap のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action Type`: `Attribute`
-   `Value`: True の場合、値のみ
-   `Entity id`: エンティティの id
-   `Entity type`: エンティティのタイプ
-   `Attribute name`: 属性名
-   `AggrMethod`: `count`, `sum`, `avg`, `min` or `max`
-   `AggrPeriod`: `year`, `month`, `day`, `hour`, `minute` or `second`
-   `LastN`: リクエスト条件を満たす最後の N 個の値のみをリクエストするために使用
-   `form Date`: コンテキスト情報がクエリされる開始日時 (包括的)
-   `Unit for date`: 開始日時の単位
-   `to Date`: コンテキスト情報がクエリされる最終日時 (包括的)
-   `Unit for date`: 終了日時の単位
-   `Georel`: 一致するエンティティと参照形状 (ジオメトリ) の間の空間関係を指定
-   `Geometry`: 地理的なクエリに使用する参照形状を指定
-   `Coords`: WGS 84 座標で参照形状 (ジオメトリ) を指定
-   `Limit`: 1回のレスポンスで取得する結果の最大数
-   `Offset`: レスポンス結果に適用するオフセット

### 例: Attributes

N タイプの N エンティティの N 属性の履歴をクエリできます。

#### 入力

```
{
  "lastN": 3
}
```

#### 出力

```
{
  "attrs": [
    {
      "attrName": "atmosphericPressure",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                1005.3,
                1005.3,
                1005.3
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "relativeHumidity",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                49.5,
                49.5,
                49.5
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "temperature",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:18.253+00:00",
                "2023-02-19T10:52:20.247+00:00",
                "2023-02-19T10:52:22.252+00:00"
              ],
              "values": [
                19.9,
                19.9,
                19.9
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    }
  ]
}
```

### 例: Attributes value

N タイプの N エンティティの N 属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "value": true,
  "lastN": 3
}
```

#### 出力

```
{
  "values": [
    {
      "attrName": "atmosphericPressure",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                1005.3,
                1005.3,
                1005.3
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "relativeHumidity",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                49.5,
                49.5,
                49.5
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    },
    {
      "attrName": "temperature",
      "types": [
        {
          "entities": [
            {
              "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
              "index": [
                "2023-02-19T10:52:46.261+00:00",
                "2023-02-19T10:52:48.262+00:00",
                "2023-02-19T10:52:50.265+00:00"
              ],
              "values": [
                19.9,
                19.9,
                19.9
              ]
            }
          ],
          "timeseriesType": "Sensor"
        }
      ]
    }
  ]
}
```

### 例: Attribute

N タイプの N エンティティの属性の履歴をクエリできます。

#### 入力

```
{
  "attrName": "temperature",
  "lastN": 3
}
```

#### 出力

```
{
  "attrName": "temperature",
  "types": [
    {
      "entities": [
        {
          "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
          "index": [
            "2023-02-01T00:00:00.000+00:00"
          ],
          "values": [
            106749
          ]
        }
      ],
      "timeseriesType": "Sensor"
    }
  ]
}
```

### 例: Attribute value

N タイプの N エンティティの属性 (値のみ) の履歴をクエリできます。

#### 入力

```
{
  "attrName": "temperature",
  "value": true,
  "lastN": 3
}
```

#### 出力

```
{
  "values": [
    {
      "entities": [
        {
          "timeseriesId": "urn:ngsi-ld:WeatherObserved:sensor001",
          "index": [
            "2023-02-01T00:00:00.000+00:00"
          ],
          "values": [
            107127.1
          ]
        }
      ],
      "timeseriesType": "Sensor"
    }
  ]
}
```

<a name="api-reference"></a>

## API リファレンス

-   [https://app.swaggerhub.com/apis/smartsdk/ngsi-tsdb/0.8.3](https://app.swaggerhub.com/apis/smartsdk/ngsi-tsdb/0.8.3)
