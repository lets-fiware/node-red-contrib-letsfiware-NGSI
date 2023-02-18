# Historical Context

このカスタム・ノードは、STH-Comet から履歴コンテキストを取得できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [未加工のコンテキスト情報](#raw-context-information)
-   [過去の集計時系列コンテキスト情報](#historical-aggregated-time-series-context-information)
-   [例](#examples)

</details>

<a name="properties"></a>

## プロパティ

このノードにより、STH-Comet から未加工のコンテキスト情報または過去の集計時系列コンテキスト情報を取得できます。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-02.png)

-   未加工のコンテキスト情報 (Raw context information)
-   過去の集計時系列コンテキスト情報 (Historical aggregate time series context information)
    -   全サンプルの平均 (Average of all the samples)
    -   最大値 (Maximum value)
    -   すべてのサンプルの合計 (Sum of all the samples)
    -   すべてのサンプルの二乗値の合計 (Sum of the square value of all the samples)
    -   文字列型の属性値に対して発生 (Occur for attributes values of type string)

対象期間の開始日と終了日を指定できます。

-   ISO 8601
-   年 (years)
-   月 (months)
-   日 (days)
-   時 (hours)
-   分 (minutes)
-   秒 (seconds)

たとえば、3 日前から 2 日前までの履歴コンテキストを取得する場合は、次のように指定します。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-03.png)

<a name="raw-context-information"></a>

## 未加工のコンテキスト情報 (Raw context information)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-04.png)

-   `name`: ノード・インスタンスの名前
-   `Generic Enabler`: STH-Comet のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Entity id`: 取得するエンティティ ID
-   `Entity type`:  取得するエンティティ・タイプ
-   `Attribute`: 取得する属性
-   `Date type`: 取得するデータ・タイプ
-   `LastN`: リクエストされた最後のエントリのみが返されます。Limit と Offset が指定されていない場合、これは必須パラメーターです
-   `Limit`: ページネーションの場合、1ページあたりのエントリ数。lastN が指定されていない場合、これは必須パラメータです
-   `Offset`: ページネーションの場合、生のコンテキスト情報の要求された検索に適用するオフセット。lastN が指定されていない場合、これは必須パラメータです
-   `Date from`: 未加工のコンテキスト情報が必要な開始日時。オプションのパラメータです
-   `Unit for data from`: 開始日時の単位
-   `Date to`: 未加工のコンテキスト情報が必要な最終日時。これはオプションのパラメーターです
-   `Unit for data to`: 最終日時の単位
-   `Output type`: `raw`, `value` または `dashboard`
-   `Count`: 要素の総数

### 入力

Payload *JSON Object*

`msg.payload` は、次のような属性を含むことができます:

```
{
  "entityId": 
  "attrName": 
  "entityType":
  "dataType": "raw"
  "lastN:
  "hLimit":
  "hOffset":
  "dateFrom:"
  "fromUnit": "ISO8601", "years", "months", "days", "hours", "minutes" または "seconds"
  "dateTo: 
  "toUnit": "ISO8601", "years", "months", "days", "hours", "minutes" または "seconds"
  "outputType: "raw", "value", "dashboard"
  "count": "true" or "false"
}
```

これらの属性はオプションです。プロパティに適切な値がある場合、空の JSON オブジェクトをこのノードに送信することで、
履歴コンテキストを取得できます。属性に値がある場合、対応するプロパティの値が上書きされます。

### 出力

Payload *JSON Object*

`msg.payload` には履歴コンテキスト・データが含まれます。

<a name="historical-aggregated-time-series-context-information"></a>

## 過去の集計時系列コンテキスト情報 (Historical Aggregated Time Series Context Information)

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-05.png)

-   `name`: ノード・インスタンスの名前
-   `Generic Enabler`: STH-Comet のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Entity id`: 取得するエンティティ ID
-   `Entity type`:  取得するエンティティ・タイプ
-   `Attribute`: 取得する属性
-   `Date type`: data type to retrieve
-   `AggrPeriod`: 集計期間または解像度
-   `Date from`: 未加工のコンテキスト情報が必要な開始日時。オプションのパラメータです
-   `Unit for data from`: 開始日時の単位
-   `Date to`: 未加工のコンテキスト情報が必要な最終日時。これはオプションのパラメーターです
-   `Unit for data to`: 最終日時の単位
-   `Output type`: `raw`, `value` または `dashboard`

### 入力

Payload *JSON Object*

`msg.payload` には、次のような属性を含むことができます:

```
{
  "entityId": 
  "attrName": 
  "entityType":
  "dataType": "ave", "max", "sum", "sum2" or "occur"
  "hLimit":
  "hOffset":
  "aggrPeriod": "month", "day", "hour", "minute" or "second"
  "dateFrom:"
  "fromUnit": "ISO8601", "years", "months", "days", "hours", "minutes" or "seconds"
  "dateTo: 
  "toUnit: 
  "outputType: "raw", "value", "dashboard"
  "count": "true" or "false"
}
```

これらの属性はオプションです。プロパティに適切な値がある場合、空の JSON オブジェクトをこのノードに送信することで、
履歴コンテキストを取得できます。属性に値がある場合、対応するプロパティの値が上書きされます。

### 出力

Payload *JSON Object*

`msg.payload` には履歴コンテキスト・データが含まれます。

<a name="examples"></a>

## 例

#### 出力 (raw)

```
{
  "type": "StructuredValue",
  "value": [
    {
      "_id": {
        "attrName": "temperature",
        "origin": "2023-01-01T00:00:00.000Z",
        "resolution": "month"
      },
      "points": [
        {
          "offset": 1,
          "samples": 20,
          "sum": 100
        },
        {
          "offset": 1,
          "samples": 0,
          "sum": 0
        }
      ]
    }
  ]
}
```

#### 出力 (value)

```
[
  {
    "_id": "63d115bb5f63eb554d85a13b",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:51.143Z"
  },
  {
    "_id": "63d115bd5f63eb554d85a141",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:53.143Z"
  },
  {
    "_id": "63d115bf5f63eb554d85a147",
    "attrName": "temperature",
    "attrType": "Number",
    "attrValue": 20.6,
    "recvTime": "2023-01-25T11:42:55.145Z"
  }
]
```

#### 出力 (dashboard)

この出力は、NGSI-to-dashboard カスタム・ノード用です。

```
{
  "type": "StructuredValue",
  "value": [
    {
      "_id": "63d115bb5f63eb554d85a13b",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:51.143Z"
    },
    {
      "_id": "63d115bd5f63eb554d85a141",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:53.143Z"
    },
    {
      "_id": "63d115bf5f63eb554d85a147",
      "attrName": "temperature",
      "attrType": "Number",
      "attrValue": 20.6,
      "recvTime": "2023-01-25T11:42:55.145Z"
    }
  ],
  "entityId": "E",
  "attrName": "A1",
  "entityType": "T1",
  "dataType": "raw"
}
```

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/historical-context/historical-context-06.png)
