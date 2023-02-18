# NGSI entity

このカスタム・ノードは、NGSIv2 エンティティの作成、読み取り、アップサート、または削除を可能にするノードです。

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-01.png)

## コンテンツ

<details>
<summary><strong>詳細</strong></summary>

-   [エンティティの作成](#create-an-entity)
-   [エンティティの読み取り](#read-an-entity)
-   [エンティティのアップサート](#upsert-an-entity)
-   [エンティティの削除](#delete-an-entity)
-   [Payload 内の actionType の値を使用](#use-value-of-actiontype-in-payload)

</details>

<a name="create-an-entity"></a>

## エンティティの作成

NGSIv2 エンティティを作成できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-02.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `create`
-   `Representation`: `normalized` または `keyValues`

### 例

#### 入力

Payload *JSON Object*

`msg.payload` には、作成するエンティティが含まれている必要があります。

```
{
  "id": "E",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-02-10T20:33:53.199Z"
      }
    }
  },
  "relativeHumidity": {
    "type": "Number",
    "value": 45,
    "metadata": {}
  },
  "atmosphericPressure": {
    "type": "Number",
    "value": 1003.5,
    "metadata": {}
  }
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
201
```

```
null
```

<a name="read-an-entity"></a>

## エンティティの読み取り

NGSIv2 エンティティを読み取ることができます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-03.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `read`
-   `Entity id`: 読み取るエンティティの id
-   `Entity type`: 読み取るエンティティのタイプ
-   `attributes`: 読み取るエンティティの属性のリスト
-   `Representation`: `normalized` または `keyValues`
-   `Date Modified`: true の場合、dateModified の属性とメタデータを取得します

### 例

#### 入力

Payload *String* または *JSON Object*

`msg.payload` には、NGSIv2 エンティティを読み取るためのエンティティ id が含まれている必要があります。

```
urn:ngsi-ld:Building:store001
```

`msg.payload` には、NGSIv2 エンティティを読み取るための条件が含まれている必要があります。

```
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
  "attrs": "humidity",
  "keyValues": true,
  "dateModified": false
}
```

#### 出力

Payload *JSON Object*

`msg.payload` には、NGSIv2 エンティティが含まれます。

```
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
}
```

<a name="upsert-an-entity"></a>

## エンティティのアップサート

NGSIv2 エンティティをアップサート (upsert) できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-04.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `upsert`
-   `Representation`: `normalized` または `keyValues`

### 例

#### 入力

Payload *JSON Object*

`msg.payload` にはアップサートするエンティティが含まれている必要があります。

```
{
  "id": "E",
  "type": "T",
  "temperature": {
    "type": "Number",
    "value": 25,
    "metadata": {
      "TimeInstant": {
        "type": "DateTime",
        "value": "2023-02-10T20:33:53.199Z"
      }
    }
  },
  "relativeHumidity": {
    "type": "Number",
    "value": 45,
    "metadata": {}
  },
  "atmosphericPressure": {
    "type": "Number",
    "value": 1003.5,
    "metadata": {}
  }
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

<a name="delete-an-entity"></a>

## エンティティの削除

NGSIv2 エンティティを削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-05.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `delete`
-   `Entity id`: 削除するエンティティの id
-   `Entity type`: 削除するエンティティのタイプ

### 例

#### 入力

Payload *String* または *JSON Object*

`msg.payload` には、NGSIv2 エンティティを削除するためのエンティティ id が含まれている必要があります。

```
urn:ngsi-ld:Building:store001
```

`msg.payload` には、NGSIv2 エンティティを削除する条件が含まれている必要があります。

```
{
  "id": "urn:ngsi-ld:Building:store001",
  "type": "Building",
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

<a name="use-value-of-actiontype-in-payload"></a>

## Payload 内の actionType の値を使用

NGSIv2 エンティティの属性を作成、読み取り、アップサート、または削除できます。

### プロパティ

![](https://raw.githubusercontent.com/lets-fiware/node-red-contrib-letsfiware-NGSI/gh-pages/images/entity/entity-06.png)

-   `name`: ノード・インスタンスの名前
-   `Context Broker`: Context Broker のエンドポイント
-   `ServicePath`: FIWARE Service Path
-   `Action type`: `value of actionType in payload`
-   `Entity id`: 作成、読み取り、アップサート、または削除するエンティティの id
-   `Entity type`: 作成、読み取り、アップサート、または削除するエンティティのタイプ
-   `Representation`: `normalized` または `keyValues`
-   `Date Modified`: true の場合、dateModified の属性とメタデータを取得します

### 例

エンティティを作成するとき、 `msg.payload` には `actionType` と `entity` を含む JSON オブジェクトが含まれている必要があります。

#### 入力

Payload *JSON Object*

```
{
  "actionType": "create",
  "entity": {
    "id": "E",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 25,
      "metadata": {
        "TimeInstant": {
          "type": "DateTime",
          "value": "2023-02-10T20:33:53.199Z"
        }
      }
    },
    "relativeHumidity": {
      "type": "Number",
      "value": 45,
      "metadata": {}
    },
    "atmosphericPressure": {
      "type": "Number",
      "value": 1003.5,
      "metadata": {}
    }
  }
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
201
```

```
null
```

エンティティを読み取る場合、 `msg.payload` には、読み取るエンティティの関連情報を含む JSON オブジェクトが含まれている必要があります。

#### 入力

Payload  *JSON Object*

```
{
  "actionType": "read",
  "id": "E",
  "type": "T"
}
```

#### 出力

Payload *JSON Object*

`msg.payload` には、エンティティを表すオブジェクトが含まれます。

```
{
  "type":"Number",
  "value":45,
  "metadata":{}
}
```

エンティティをアップサートする場合、 `msg.payload` には `actionType` と `entity` を含む JSON オブジェクトが含まれている必要があります

#### 入力

Payload  *JSON Object*

```
{
  "actionType": "upsert",
  "entity": {
    "id": "E",
    "type": "T",
    "temperature": {
      "type": "Number",
      "value": 29,
      "metadata": {
        "TimeInstant": {
          "type": "DateTime",
          "value": "2023-02-10T20:33:53.199Z"
        }
      }
    },
    "relativeHumidity": {
      "type": "Number",
      "value": 58,
      "metadata": {}
    },
    "atmosphericPressure": {
      "type": "Number",
      "value": 1234.5,
      "metadata": {}
    }
  }
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```

エンティティを削除する場合、`msg.payload` には、削除するエンティティの関連情報を含む JSON オブジェクトが含まれている必要があります。

#### 入力

Payload  *JSON Object*

```
{
  "actionType": "delete",
  "id": "E",
  "type": "T"
}
```

#### 出力

Payload *Number* または *null*

`msg.payload` にはステータス・コードが含まれています。

```
204
```

```
null
```
