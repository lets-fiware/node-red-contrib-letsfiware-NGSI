# NGSI Source

このカスタム・ノードは、NGSIv2 エンティティを取得できるノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source/source-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [プロパティ](#properties)
-   [入力](#input)
-   [出力](#output)
-   [例](#example)

</details>

<a name="properties"></a>

## プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/source/source-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Representation`: `normalized` または `keyValues`
-   `Entity type`: 読み取り対象となるエンティティ・タイプ
-   `ID pattern`: 読み取り対象となるエンティティの id パターン
-   `Attrs`: 読み取り対象となるエンティティの属性のリスト
-   `Query`: Simple Query Language を使用したクエリ条件
-   `Buffering`: 取得したすべてのエンティティを一度に出力するかどうか
-   `Decode forbidden chars`: `off` または `on`

<a name="input"></a>

## 入力

payload *JSON Object*

`msg.payload` には、NGSIv2 エンティティを取得するためのクエリ条件が含まれている必要があります。

```json
{
  "idPattern": ".*",
  "type": "T",
  "attrs": [
    "humidity"
  ],
  "q": "temperature>29",
  "keyValues": true
}
```

<a name="output"></a>

## 出力

payload *JSON Array*

`msg.payload` には NGSIv2 エンティティが含まれます。

statusCode *Number*

A `msg.statusCode` contains a status code.

```text
200
```

<a name="example"></a>

## 例

### 入力 1

```json
{
  "idPattern": ".*"
}
```

### 出力 1

```json
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {}
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 30,
      "metadata": {}
    }
  }
]
```

### 入力 2

```json
{
  "type": "T",
  "attrs": [
    "humidity"
  ]
}
```

### 出力 2

```json
[
  {
    "id": "E1",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 51,
      "metadata": {}
    }
  },
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    }
  }
]
```

### 入力 3

```json
{
  "type": "T",
  "q": "temperature>29"
}
```

### 出力 3

```json
[
  {
    "id": "E2",
    "type": "T",
    "humidity": {
      "type": "Number",
      "value": 50,
      "metadata": {}
    },
    "temperature": {
      "type": "Number",
      "value": 30,
      "metadata": {}
    }
  }
]
```

### 入力 4

```json
{
  "type": "T",
  "q": "temperature>29",
  "keyValues": true
}
```

### 出力 4

```json
[
  {
    "id": "E2",
    "type": "T",
    "humidity": 50,
    "temperature": 30
  }
]
```
